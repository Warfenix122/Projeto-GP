import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { EmailSenderService } from '../services/email-sender.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-internal-user-signup',
  templateUrl: './internal-user-signup.component.html',
  styleUrls: ['./internal-user-signup.component.css']
})
export class InternalUserSignupComponent implements OnInit {


  constructor(private service: UserService, private emailService: EmailSenderService, public _fb: FormBuilder, private router: Router, private _alertService: AlertService) {
  }

  formIPS = this._fb.group({
    email: new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
  }

  get email() {
    return this.formIPS.get('email');
  }

  postData() {
    if (this.formIPS.valid) {
      let pass = this.generatepassword(this.formIPS.value.email);
      let formbody = { ... this.formIPS.value, password: pass, tipoMembro: "Voluntario Interno" };
      this.service.register(formbody).subscribe((res) => {
        this._alertService.success("Utilizador Registado");
        // Send Email
        this.emailService.sendConfirmationEmail(formbody.email, formbody.nome).subscribe((response) => {
          this.router.navigate(['login']);
        }, (err) => {
          this._alertService.error(err["error"].msg);
        });


        this.emailService.sendEmail(formbody.email, "Password", "Password: " + pass).subscribe((responnse) => {
        }, (err) => {
          this._alertService.error(err.error.msg);
        });


        // REDIRECT
        this.router.navigate(['login']);
      }, (err) => {
        this._alertService.error(err.error.msg);
      });
    } else {
      this._alertService.error("Formulário Invalido");
    }
  }

  generatepassword(email) {
    const pass = email.slice(0, email.indexOf('@'));
    let endpass = '';
    for (let index = 0; index < pass.length; index++) {
      const asci = pass.charCodeAt(index);
      endpass += asci % 10;

    }
    return endpass;
  }

}
