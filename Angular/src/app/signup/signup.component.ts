import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import statics from '../../assets/statics.json';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EmailSenderService } from '../services/email-sender.service';
import { AlertService } from '../services/alert.service';


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
  generos: string[] = statics.generos;
  filteredConcelhos: Observable<string[]>;
  filteredDistritos: Observable<string[]>;


  selectedAreas: Array<String>;
  selectedAreasError: Boolean
  constructor(private userService: UserService, private authService: AuthService, private emailService: EmailSenderService, public _fb: FormBuilder, private router: Router, private _alertService: AlertService) {
  }

  formRegisto = this._fb.group({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  formInformacao = this._fb.group({
    nome: new FormControl('', [Validators.required]),
    dataNascimento: new FormControl('', [Validators.required]),
    genero: new FormControl('', [Validators.required]),
    numeroTelefone: new FormControl(''),
    distrito: new FormControl(''),
    concelho: new FormControl(''),
  });

  formPreferencias = this._fb.group({
    tipoMembro: new FormControl('', [Validators.required]),
    escola: new FormControl(''),
    formacao: new FormControl(''),
    areas: this.addAreasInteresseControls(),
    RGPD: new FormControl(false, [Validators.requiredTrue]),
  });

  ngOnInit() {
    this.filteredConcelhos = this.formInformacao.get('concelho').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterConcelho(value))
      );
    this.filteredDistritos = this.formInformacao.get('distrito').valueChanges
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

  generoSelecionado(e) {
    this.genero.setValue(e.target.value, {
      onlySelf: true,
    })
  }

  formacaoSelecionada(e) {
    this.formacao.setValue(e.target.value, {
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

  RGPDchecked(e) {

    if (e.checked) {
      this.RGPD.setValue(true);
    } else {
      this.RGPD.setValue(false);
    }
  }

  get genero() {
    return this.formInformacao.get("genero");
  }

  get dataNascimento() {
    return this.formInformacao.get("dataNascimento");
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
    return this.formInformacao.get('nome');
  }

  get escola() {
    return <FormArray>this.formPreferencias.get('escola');
  }

  get tipoMembro() {
    return <FormArray>this.formPreferencias.get('tipoMembro');
  }

  get formacao() {
    return <FormArray>this.formPreferencias.get('formacao');
  }

  get distrito() {
    return <FormArray>this.formInformacao.get('distrito');
  }

  get areasArray() {
    return <FormArray>this.formPreferencias.get('areas');
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

  }

  postData() {
    if (this.formRegisto.valid && this.formInformacao.valid && this.formPreferencias.valid) {
      const selectedAreas = this.selectedAreas;
      let formbody = { ...this.formRegisto.value, ...this.formInformacao.value, ...this.formPreferencias.value, selectedAreas };
      this.userService.register(formbody).subscribe((res) => {
        let successMsg = "";
        if (formbody.tipoMembro === 'Voluntario Interno') {
          this.emailService.sendConfirmationEmail(formbody.email, formbody.nome).subscribe((response) => {
          }, (err) => {
            this._alertService.error(err.error.msg);
          });
          this.router.navigate(['login']);
          this._alertService.warning("Recebeu um email para completar o registo da sua conta. Complete o registo clicando no botão 'Completar registo' no email recebido.");
        } else {
          this.router.navigate(['login']);
          this._alertService.success("Conta criada com sucesso. Por favor aguarde aprovação!");
        }
      }, (err) => {
        if(err.statusText == "Conflict")
          this._alertService.error("Já existe um utilizador com esse email. Por favor use outro email para continuar.");
      });
    } else {
      this._alertService.error("Não preencheu todos os campos obrigatórios");
    }
  }
}
