import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../../models/utilizadores';
import statics from '../../assets/statics.json';
import { AlertService } from '../services/alert.service';
import { HttpClient } from '@angular/common/http';
import { ReadVarExpr } from '@angular/compiler';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  @ViewChild('image') img: ElementRef;
  user: any = User;
  userInfo: any;
  existsImage: boolean = false;
  file: any;
  constructor(private http: HttpClient, public _fb: FormBuilder, private userService: UserService, private _alertService: AlertService) {
  }
  formImage = this._fb.group({});

  ngOnInit() {
    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      this.user = res['user'];
      this.userInfo = [];
      this.userInfo.push({ key: 'Email', value: this.user.email });
      this.userInfo.push({ key: 'Data de Nascimento', value: this.user.dataNascimento });
      this.userInfo.push({ key: 'Distrito', value: this.user.distrito });
      this.userInfo.push({ key: 'Concelho', value: this.user.concelho });
      this.userInfo.push({ key: 'Número de Telefone', value: this.user.numeroTelefone });
      this.userInfo.push({ key: 'Data de Criação de Conta', value: this.user.dataCriacao });
      this.userInfo.push({ key: 'Tipo de Membro', value: this.user.tipoMembro });
      this.getProfilePhoto(this.user.email);
    });

  }


  getProfilePhoto(email) {

    const formData = { 'email': email }
    this.userService.getProfilePhoto(formData).subscribe((res) => {
      const src = this.arrayBufferToBase64(res['foto'].data);
      this.img.nativeElement.src = 'data:' + res['foto'].contentType + ';base64,' + src;
    }, (err) => {
      this._alertService.error(err.error.msg);
    }, () => {

    });
  }
  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  onFileChanged(event) {
    this.file = event.target.files[0];
  }

  onUpload() {
    const formData = new FormData();
    formData.append('email', this.user.email);
    formData.append('file', this.file, this.file.name);

    const reader = new FileReader();
    const mail = this.user.email;
    const userservice = this.userService;
    const alert = this._alertService;
    reader.onloadend = () => {
      const src = reader.result;
      userservice.uploadPhoto(formData).subscribe((res) => {
        alert.success("Sucesso");
      }, (err) => {
        alert.error(err.error.msg);
      });
    };
    reader.readAsDataURL(this.file);

  }
}
