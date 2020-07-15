import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { EmailSenderService } from '../services/email-sender.service';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-gestor',
  templateUrl: './create-gestor.component.html',
  styleUrls: ['./create-gestor.component.css']
})
export class CreateGestorComponent implements OnInit {


  constructor(private userService: UserService, private authService: AuthService,
    private emailService: EmailSenderService, public _fb: FormBuilder, private _alertService: AlertService, private router: Router) {
  }

  formGestor = this._fb.group({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    nome: new FormControl('', [Validators.required]),
    dataNascimento: new FormControl('', [Validators.required]),
    numeroTelefone: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {

    if (!this.authService.isLoggedIn())
      this.router.navigate(['unauthorized']);
    this.authService.getRole().subscribe(res => {
      if (res["Role"] !== "Gestor")
        this.router.navigate(['unauthorized']);
    });
  }
  postData() {
    if (this.formGestor.valid) {
      let formbody = { ...this.formGestor.value, tipoMembro: 'Gestor' };
      this.userService.register(formbody).subscribe((res) => {
        this._alertService.success("Conta criada com sucesso!");
        this.emailService.sendConfirmationEmail(formbody.email, formbody.nome);
      }, (err) => {
        if (err.statusText == "Conflict") {
          this._alertService.error("Já existe um utilizador com esse email. Por favor use outro email para continuar.");
        }
      });
    } else {
      this._alertService.error("Não preencheu todos os campos obrigatórios");
    }

  }

  get numeroTelefone() {
    return this.formGestor.get("numeroTelefone")
  }


  get dataNascimento() {
    return this.formGestor.get("dataNascimento");
  }

  get confirmPassword() {
    return this.formGestor.get('confirmPassword');
  }

  get password() {
    return this.formGestor.get('password');
  }

  get email() {
    return this.formGestor.get('email');
  }

  get nome() {
    return this.formGestor.get('nome');
  }
}
