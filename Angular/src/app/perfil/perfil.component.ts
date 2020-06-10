import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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


  user: User;
  userInfo: any;
  existsImage: false;
  images: any;
  file: File;
  constructor(private http: HttpClient, public _fb: FormBuilder, private userService: UserService, private _alertService: AlertService) {
  }

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
    });

  }
  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }


  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.images);
    formData.append('email', this.user.email);
    this.userService.uploadPhoto(formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

}
