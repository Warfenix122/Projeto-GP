import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RootComponent } from './root/root.component';
import { AproveUserComponent } from './aprove-user/aprove-user.component';
import { InternalUserSignupComponent } from './internal-user-signup/internal-user-signup.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { AlterPasswordComponent } from './alter-password/alter-password.component';


const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'dashboard', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'root', component: RootComponent },
  { path: 'userAprove', component: AproveUserComponent },
  { path: 'ips_signup', component: InternalUserSignupComponent },
  { path: 'profile', component: PerfilComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'recover', component: RecoverPasswordComponent },
  { path: 'alterPassword', component: AlterPasswordComponent },
  { path: 'api/confirmAccount/:email', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]

})
export class AppRoutingModule { }
