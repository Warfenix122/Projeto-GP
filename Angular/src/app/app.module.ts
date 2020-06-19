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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field'

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

import { InterceptorAutenticacao } from './Interceptor/interceptor-autenticacao';
import { CompareValidatorDirective } from './validators/compare-validator.directive';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertService } from './services/alert.service';
import { AlterPasswordComponent } from './alter-password/alter-password.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { TelephoneValidatorDirective } from './validators/telephone-validator.directive';
import { PasswordValidatorDirective } from './validators/password-validator.directive';
import { NameValidatorDirective } from './validators/name-validator.directive';
import { DateValidatorDirective } from './validators/date-validator.directive';
import { EmailValidatorDirective } from './validators/email-validator.directive';
import { EditCarrouselComponent } from './edit-carrousel/edit-carrousel.component';
import { FavoriteProjectComponent } from './favorite-project/favorite-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { MatNativeDateModule } from '@angular/material/core';
import { SondagemComponent } from './sondagem/sondagem.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { CreateSondagemComponent } from './create-sondagem/create-sondagem.component';
import { CreateGestorComponent } from './create-gestor/create-gestor.component';
import { ProjectComponent } from './project/project.component';


@NgModule({

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    MatSlideToggleModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
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
    AlertsComponent,
    AlterPasswordComponent,
    ListProjectsComponent,
    EditProfileComponent,
    TelephoneValidatorDirective,
    PasswordValidatorDirective,
    NameValidatorDirective,
    DateValidatorDirective,
    EmailValidatorDirective,
    EditCarrouselComponent,
    FavoriteProjectComponent,
    CreateProjectComponent,
    EditProfileComponent,
    SondagemComponent,
    EditProjectComponent,
    ProjectComponent,
    MainComponent,
    CreateSondagemComponent,
    CreateGestorComponent,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorAutenticacao,
    multi: true
  }, AlertsComponent, MatNativeDateModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
