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
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditCarrouselComponent } from './edit-carrousel/edit-carrousel.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { CreateSondagemComponent } from './create-sondagem/create-sondagem.component';
import { CreateGestorComponent } from './create-gestor/create-gestor.component';
import { ProjectComponent } from './project/project.component';
import {AproveProjectsComponent} from './aprove-projects/aprove-projects.component';
import { FaqsComponent } from './faqs/faqs.component';


const routes: Routes = [
  { path: '', component: MainComponent },
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
  { path: 'editProfile', component: EditProfileComponent },
  { path: 'editCarrosel', component: EditCarrouselComponent },
  { path: 'api/confirmAccount/:email', component: LoginComponent },
  { path: 'createProject', component: CreateProjectComponent },
  { path: 'projects', component: ListProjectsComponent },
  { path: 'projectsAprove', component: AproveProjectsComponent},
  { path: 'createSondagem', component: CreateSondagemComponent },
  { path: 'createGestor', component: CreateGestorComponent },
  { path: 'projects/:id', component: ProjectComponent},
  { path: 'api/confirmAccount/:email', component: LoginComponent },
  { path: 'faqs', component: FaqsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]

})
export class AppRoutingModule { }
