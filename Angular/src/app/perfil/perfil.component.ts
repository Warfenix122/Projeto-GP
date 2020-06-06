import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../../../models/utilizadores';
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EmailSenderService } from '../services/email-sender.service';


import statics from '../../assets/statics.json';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  distritos: string[] = statics.distritos;
  concelhos: string[] = statics.Concelhos;
  generos: string[] = statics.generos;

  filteredConcelhos: Observable<string[]>;
  filteredDistritos: Observable<string[]>;

  @ViewChild('tipoMembro') type: ElementRef;
  @ViewChild('dataCriacao') dataCriacao: ElementRef;
  @ViewChild('email') email: ElementRef;

  constructor(private userService: UserService, public _fb: FormBuilder, private router: Router) {
  }
  oldForm: any;
  formProfile = this._fb.group({
    nome: new FormControl(''),
    genero: new FormControl(''),
    dataNascimento: new FormControl(''),
    password: new FormControl(''),
    numeroTelefone: new FormControl(''),
    distrito: new FormControl(''),
    concelho: new FormControl(''),
    tipoMembro: new FormControl(''),
    dataCriacao: new FormControl('')
  });

  ngOnInit() {
    this.filteredConcelhos = this.formProfile.get('concelho').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterConcelho(value))
      );
    this.filteredDistritos = this.formProfile.get('distrito').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterDistrito(value))
      );


    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {

      let user = res['user'];

      this.formProfile = this._fb.group({
        nome: new FormControl(user.nome, [Validators.required]),
        genero: new FormControl(user.genero),
        dataNascimento: new FormControl(user.dataNascimento),
        password: new FormControl(''),
        numeroTelefone: new FormControl(user.numeroTelefone),
        distrito: new FormControl(user.distrito),
        concelho: new FormControl(user.concelho),
      });

      this.dataCriacao.nativeElement.innerHTML = user.dataCriacao;
      this.type.nativeElement.innerHTML = user.tipoMembro;
      this.email.nativeElement.innerHTML = user.email;
      this.oldForm = this.formProfile.value;
    }, (err) => {
      console.log('error during post is ', err);
    });



  }

  private _filterConcelho(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.concelhos.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterDistrito(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.distritos.filter(option => option.toLowerCase().includes(filterValue));
  }


  updateData() {
    let formbody = {};
    let form = this.formProfile.value;
    if (this.formProfile.valid) {
      for (const key in form) {
        if (this.oldForm[key] !== form[key]) {
          formbody[key] = form[key];
        }
      }

      formbody['email'] = this.email.nativeElement.innerHTML;
      console.log(formbody)
      this.userService.editUser(formbody).subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.log('error during post is ', err);
      }, () => {

      });
    } else {
      console.log('formulario invalido');
    }
  }
}
