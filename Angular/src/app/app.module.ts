import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatStepperModule, MatStep } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SignupComponent } from './signup/signup.component';

import { RootComponent } from './root/root.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AproveUserComponent } from './aprove-user/aprove-user.component';
import { InternalUserSignupComponent } from './internal-user-signup/internal-user-signup.component';
import { FooterComponent } from './footer/footer.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

import {InterceptorAutenticacao} from './Interceptor/interceptor-autenticacao';
import { CompareValidatorDirective } from './validators/compare-validator.directive';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertService } from './services/alert.service';


@NgModule({

  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule,

  ],
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    SignupComponent,
    RootComponent,
    AproveUserComponent,
    InternalUserSignupComponent,
    FooterComponent,
    PerfilComponent,
    UnauthorizedComponent,
    RecoverPasswordComponent,
    CompareValidatorDirective,
    AlertsComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorAutenticacao,
    multi: true
  },AlertsComponent],
  bootstrap: [AppComponent, MainComponent, LoginComponent, SignupComponent, NavComponent, InternalUserSignupComponent,AproveUserComponent,AlertsComponent,RecoverPasswordComponent,UnauthorizedComponent],
})
export class AppModule { }
