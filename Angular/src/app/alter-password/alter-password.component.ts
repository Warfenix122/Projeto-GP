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
  selector: 'app-alter-password',
  templateUrl: './alter-password.component.html',
  styleUrls: ['./alter-password.component.css']
})
export class AlterPasswordComponent implements OnInit {

  constructor(private userService: UserService, public _fb: FormBuilder, private router: Router, private _alertService: AlertService) { }


  formPassword = this._fb.group({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
  }

  alterPassword() {
    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      const user = res['user'];
      // devia de ser verificado se a password do user é igual à oldpassword
      let formbody = {
        email: user.email,
        password: this.formPassword.value['password']
      };
      this.userService.alterPassword(formbody).subscribe((res) => {
        this.router.navigate(['/profile']);
      }, (err) => {
        this._alertService.error("Não preencheu todos os campos obrigatórios");
      }, () => {

      });

    });

  }

  get oldpassword() {
    return this.formPassword.get('oldpassword');
  }

  get confirmPassword() {
    return this.formPassword.get('confirmPassword');
  }

  get password() {
    return this.formPassword.get('password');
  }
}
