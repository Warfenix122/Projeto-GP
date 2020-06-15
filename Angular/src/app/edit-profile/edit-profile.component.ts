import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../../models/utilizadores';
import statics from '../../assets/statics.json';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  filteredConcelhos: Observable<string[]>;
  filteredDistritos: Observable<string[]>;
  user: any = User;

  @ViewChild('tipoMembro') type: ElementRef;
  @ViewChild('dataCriacao') dataCriacao: ElementRef;
  @ViewChild('email') email: ElementRef;
  distritos: string[] = statics.distritos;
  concelhos: string[] = statics.Concelhos;
  generos: string[] = statics.generos;

  constructor(private userService: UserService, public _fb: FormBuilder, private router: Router, private _alertService: AlertService) {
  }
  oldForm: any;
  formProfile = this._fb.group({
    nome: new FormControl('',Validators.required),
    genero: new FormControl('',Validators.required),
    dataNascimento: new FormControl(''),
    numeroTelefone: new FormControl('',Validators.required),
    distrito: new FormControl('',Validators.required),
    concelho: new FormControl('',Validators.required)
  });

  ngOnInit(): void {
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

      this.user = res['user'];
      this.formProfile = this._fb.group({
        nome: new FormControl(this.user.nome, [Validators.required]),
        genero: new FormControl(this.user.genero),
        dataNascimento: new FormControl(this.user.dataNascimento),
        password: new FormControl(''),
        numeroTelefone: new FormControl(this.user.numeroTelefone),
        distrito: new FormControl(this.user.distrito),
        concelho: new FormControl(this.user.concelho),
      });

      this.dataCriacao.nativeElement.innerHTML = this.user.dataCriacao;
      this.type.nativeElement.innerHTML = this.user.tipoMembro;
      this.email.nativeElement.innerHTML = this.user.email;
      this.oldForm = this.formProfile.value;
    }, (err) => {
      this._alertService.error(err.error.msg);
    });



  }

  get numeroTelefone() {
    return this.formProfile.get("numeroTelefone")
  }

  get genero() {
    return this.formProfile.get("genero");
  }

  get dataNascimento() {
    return this.formProfile.get("dataNascimento");
  }

  get nome() {
    return this.formProfile.get('nome');
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
      this.userService.editUser(formbody).subscribe((res) => {
        this._alertService.success("Alterações Guardadas!");
      }, (err) => {
        this._alertService.error(err.error.msg);
      }, () => {

      });
    } else {
      this._alertService.error('Formulário Invalido');
    }
  }
}
