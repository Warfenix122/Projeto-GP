import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { EmailSenderService } from '../services/email-sender.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  constructor(private service: UserService, private emailService: EmailSenderService, public _fb: FormBuilder, private router: Router,private _alertService: AlertService) {
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
      let formbody = { ... this.formIPS.value, password: pass };
      this.service.alterPassword(formbody).subscribe((res) => {
        // Send Email
        this.emailService.sendRecoverPasswordEmail(formbody.email, pass).subscribe((responnse) => {
        }, (err) => {
          this._alertService.error(err.error.msg);
        });

        // REDIRECT
        this.router.navigate(['login']);
      }, (err) => {
        this._alertService.error(err.error.msg);
      });
    } else {
      this._alertService.error("Não preencheu todos os campos obrigatórios");
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
