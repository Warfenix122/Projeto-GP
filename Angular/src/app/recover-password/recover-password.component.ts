import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { EmailSenderService } from '../services/email-sender.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  constructor(private service: UserService, private emailService: EmailSenderService, public _fb: FormBuilder, private router: Router) {
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
        this.router.navigate(['login']);
        // Send Email
        this.emailService.sendRecoverPasswordEmail(formbody.email, pass).subscribe((responnse) => {
        }, (err) => {
          console.log('error during post is ', err);
        });


        // REDIRECT
        this.router.navigate(['login']);
      }, (err) => {
        console.log('error during post is ', err);
      });
    } else {
      console.log('formulario invalido');
    }
  }

  generatepassword(email) {
    const pass = email.slice(0, email.indexOf('@'));
    let endpass = '';
    for (let index = 0; index < pass.length; index++) {
      const asci = pass.charCodeAt(index);
      endpass += asci % 10;

    }
    console.log(endpass);
    return endpass;
  }


}
