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
import { FileService } from '../services/file.service';
import { FotoService } from '../services/foto.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  @ViewChild('image') img: ElementRef;
  @ViewChild('checkboxes') checkboxes: ElementRef;
  @ViewChild('saveAreas') saveAreas: ElementRef;

  //buttonSupport
  showEditAreasOfInterest: boolean = true;

  user: any = User;
  userInfo: any;
  existsImage: boolean = false;
  file: any;
  static = new Array();
  areas: Array<String> = statics.areas;
  form = this._fb.group({
    areas: '',
  });
  addPhotoResult: any;
  selectedPhotoFileName: string;

  selectedAreas: Array<String>;
  selectedAreasError: Boolean
  constructor(private _authService: AuthService, private router: Router, private http: HttpClient, public _fb: FormBuilder, private fotoService: FotoService, private userService: UserService, private fileService: FileService, private _alertService: AlertService, private elem: ElementRef) {
  }


  ngOnInit() {
    if (this._authService.isLoggedIn()) {

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

        this.getProfilePhoto(this.user.fotoPerfilId);

        this.form = this._fb.group({
          areas: this.addAreasInteresseControls(this.user.areasInteresse),
        });

        for (const are of statics.areas) {
          this.form.controls['areas'].disable();
        }
      });
    } else {
      this.router.navigate(['unauthorized']);

    }
  }

  ngAfterViewInit() {
    let element = this.elem.nativeElement.querySelector('.mat-tab-body-content');
    element.style.overflowX = 'hidden';
  }

  getSrc(foto) {
    if (foto) {
      return 'data:' + foto.contentType + ';base64,' + foto.src;
    }
    else {
      return "https://higuma.github.io/bootstrap-4-tutorial/img/286x180.svg";
    }
  }

  getProfilePhoto(fotoID) {
    this.fotoService.getUserPhoto(fotoID).then((fotos) => {
      this.img.nativeElement.src = this.getSrc(fotos[0]);
    })
  }

  onFileSelected(event) {
    let files = event.target.files;
    if (files.length > 0) {
      this.file = files[0]
      this.selectedPhotoFileName = files[0].name;
    }

    const inputNode: any = document.querySelector('#file');
    const formdata = new FormData();
    formdata.append('file', this.file, this.file.name);
    if (typeof (FileReader) !== 'undefined') {


      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.addPhotoResult = e.target.result;
      };
      reader.onloadend = () => {
        const src = reader.result;
        this.fileService.updateProfilePhoto(formdata).then(user => {
          this.user.fotoPerfilId = user.fotoPerfilId;
          this.getProfilePhoto(user.fotoPerfilId);
        })
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  onDelete() {
    let oldPhoto = this.user.fotoPerfilId;
    this.userService.removeProfilePhoto(this.user._id).subscribe(() => {
      this.fileService.deletePhoto(oldPhoto).subscribe(() => {
        this.user.fotoPerfilId = null;
        this.img.nativeElement.src = this.getSrc(undefined);
      })
    })
  }

  alterAreasInteresse() {
    if (this.showEditAreasOfInterest) {
      this.showEditAreasOfInterest = false;
      this.form.controls['areas'].enable();
    } else {
      this.showEditAreasOfInterest = true;
      this.form.controls['areas'].disable();
    }
  }

  saveAreasInteresse() {
    this.showEditAreasOfInterest = true;
    this.saveAreas.nativeElement.style.display = 'none';
    const selectedAreas = this.selectedAreas;
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
