import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Attribute } from '@angular/core';
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
import { Injectable, Output, EventEmitter } from '@angular/core';
import * as moment from "moment";
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  @ViewChild('image') img: ElementRef;
  @ViewChild('checkboxes') checkboxes: ElementRef;
  @ViewChild('editAreas') editAreas: ElementRef;
  @ViewChild('saveAreas') saveAreas: ElementRef;
  user: any = User;
  userInfo: any;
  existsImage: boolean = false;
  file: any;
  static = new Array();
  areas: Array<String> = statics.areas;
  form = this._fb.group({
    areas: '',
  });

  selectedAreas: Array<String>;
  selectedAreasError: Boolean
  constructor(private http: HttpClient, public _fb: FormBuilder, private userService: UserService, private _alertService: AlertService) {
  }


  ngOnInit() {

    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      this.user = res['user'];
      this.userInfo = [];
      this.userInfo.push({ key: 'Email', value: this.user.email });
      const brithDate = new Date(this.user.dataNascimento);
      const strBirth = brithDate.getDay().toString().concat("/", brithDate.getMonth().toString(), "/", brithDate.getFullYear().toString())
      this.userInfo.push({ key: 'Data de Nascimento', value: strBirth });
      this.userInfo.push({ key: 'Distrito', value: this.user.distrito });
      this.userInfo.push({ key: 'Concelho', value: this.user.concelho });
      this.userInfo.push({ key: 'Número de Telefone', value: this.user.numeroTelefone });
      const creationDate = new Date(this.user.dataCriacao);
      const strCreation = creationDate.getDay().toString().concat("/", creationDate.getMonth().toString(), "/", creationDate.getFullYear().toString())
      this.userInfo.push({ key: 'Data de Criação de Conta', value: strCreation });
      this.userInfo.push({ key: 'Tipo de Membro', value: this.user.tipoMembro });
      this.getProfilePhoto(this.user.email);

      this.form = this._fb.group({
        areas: this.addAreasInteresseControls(this.user.areasInteresse),
      });

      for (const are of statics.areas) {
        this.form.controls['areas'].disable();
      }
    });
  }


  getProfilePhoto(email) {
    const formData = { 'email': email }
    this.userService.getProfilePhoto(formData).subscribe((res) => {
      const src = this.arrayBufferToBase64(res['foto'].data);
      this.img.nativeElement.src = 'data:' + res['foto'].contentType + ';base64,' + src;
    }, (err) => {
      this._alertService.error("Dificuldade em encontrar a foto. Tente de novo, dentro de 30 segundos");
    }, () => {

    });
  }
  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  }

  onFileChanged(event) {
    this.file = event.target.files[0];
  }

  onUpload() {
    const formData = new FormData();
    formData.append('email', this.user.email);
    formData.append('file', this.file, this.file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result;
      this.userService.uploadPhoto(formData).subscribe((res) => {
        this._alertService.success("Foto Atualizada");
        this.getProfilePhoto(this.user.email);
      }, (err) => {
        this._alertService.error("Impossivel atualizar a foto, tente utilizar outra foto!");
      });
    };
    reader.readAsDataURL(this.file);

  }
  alterAreasInteresse() {
    this.saveAreas.nativeElement.style.display = 'block';
    this.editAreas.nativeElement.style.display = 'none';
    this.form.controls['areas'].enable();
  }
  saveAreasInteresse() {
    this.editAreas.nativeElement.style.display = 'block';
    this.saveAreas.nativeElement.style.display = 'none';
    const selectedAreas = this.selectedAreas;
    console.log('selectedAreas :>> ', selectedAreas);
    let user = this.user;
    user.areasInteresse = selectedAreas;
    const formdata = user;
    this.userService.editUser(formdata).subscribe((res) => {
      this._alertService.success(res['success'].message);

      this.form.controls['areas'].disable();

    })

  }

  getSelectedAreas() {
    this.selectedAreas = [];
    this.areasArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedAreas.push(this.areas[i]);
      }
    });
    this.selectedAreasError = this.selectedAreas.length > 0 ? false : true;

  }
  get areasArray() {
    return <FormArray>this.form.get('areas');
  }

  addAreasInteresseControls(userAreas) {
    const arr = this.areas.map(element => {
      if (userAreas.includes(element)) {
        return this._fb.control(true);
      } else {
        return this._fb.control(false);
      }
    });
    return this._fb.array(arr);
  }
}
