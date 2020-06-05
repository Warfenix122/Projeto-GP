import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import statics from '../../assets/statics.json';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EmailSenderService } from '../services/email-sender.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  escolas: Array<String> = statics.escolas;
  areas: Array<String> = statics.areas;
  tiposMembro: Array<String> = statics.tipoUtilizadores;
  formacoes: Array<String> = statics.fomação;
  distritos: string[] = statics.distritos;
  concelhos: string[] = statics.Concelhos;
  filteredConcelhos: Observable<string[]>;
  filteredDistritos: Observable<string[]>;

  selectedAreas: Array<String>;
  selectedAreasError: Boolean
  constructor(private userService: UserService, private authService: AuthService, private emailService: EmailSenderService, public _fb: FormBuilder, private router: Router) {
  }

  formRegisto = this._fb.group({
    nome: new FormControl('', [Validators.required]),
    dataNascimento: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    numeroTelefone: new FormControl(''),
    distrito: new FormControl(''),
    concelho: new FormControl(''),
    tipoMembro: new FormControl('', [Validators.required]),
    escola: new FormControl(''),
    formacao: new FormControl(''),
    // areas: this.addAreasInteresseControls(),
  });

  formPreferencias = this._fb.group({
    areas: this.addAreasInteresseControls(),
    regulamento: new FormControl(false, [Validators.required]),
    RGPD: new FormControl(false, [Validators.required]),
  });
  ngOnInit() {
    this.filteredConcelhos = this.formRegisto.get('concelho').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterConcelho(value))
      );
    this.filteredDistritos = this.formRegisto.get('distrito').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterDistrito(value))
      );
  }

  private _filterConcelho(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.concelhos.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterDistrito(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.distritos.filter(option => option.toLowerCase().includes(filterValue));
  }

  addAreasInteresseControls() {
    const arr = this.areas.map(element => {
      return this._fb.control(false);
    });
    return this._fb.array(arr);
  }

  escolaSelecionada(e) {
    this.escola.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  formacaoSelecionada(e) {
    this.escola.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  tipoMembroSelecionado(e) {
    this.tipoMembro.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  distritoSelecionado(e) {
    this.distrito.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get dataNascimento() {
    return this.formRegisto.get("dataNascimento");
  }

  get confirmPassword() {
    return this.formRegisto.get('confirmPassword');
  }

  get password() {
    return this.formRegisto.get('password');
  }

  get email() {
    return this.formRegisto.get('email');
  }

  get nome() {
    return this.formRegisto.get('nome');
  }

  get escola() {
    return <FormArray>this.formRegisto.get('escola');
  }

  get tipoMembro() {
    return <FormArray>this.formRegisto.get('tipoMembro');
  }

  get formacao() {
    return <FormArray>this.formRegisto.get('formacao');
  }

  get distrito() {
    return <FormArray>this.formRegisto.get('distrito');
  }

  get areasArray() {
    return <FormArray>this.formPreferencias.get('areas');
  }

  get regulamento() {
    return this.formPreferencias.get('regulamento');
  }

  get RGPD() {
    return this.formPreferencias.get('RGPD');
  }

  getSelectedAreas() {
    this.selectedAreas = [];
    this.areasArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedAreas.push(this.areas[i]);
      }
    });
    this.selectedAreasError = this.selectedAreas.length > 0 ? false : true;
    console.log(this.selectedAreas);
  }

  postData() {
    if (this.formRegisto.valid && this.formPreferencias.valid) {
      const selectedAreas = this.selectedAreas;
      let formbody = { ...this.formRegisto.value, selectedAreas };
      this.userService.register(formbody).subscribe((res) => {

        // Send Email
        this.emailService.sendConfirmationEmail(formbody).subscribe((responnse) => {
        }, (err) => {
          console.log('error during post is ', err);
        });

        // REDIRECT
        this.router.navigate(['login']);
      }, (err) => {
        console.log('error during post is ', err);
      }, () => {

      })
    } else {
      console.log('formulario invalido');
    }
  }
}
