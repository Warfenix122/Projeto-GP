import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from 'models/projeto';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from 'models/utilizadores';
import { Router } from '@angular/router';
import { EmailSenderService } from '../services/email-sender.service';

@Component({
  selector: 'app-aprove-projects',
  templateUrl: './aprove-projects.component.html',
  styleUrls: ['./aprove-projects.component.css'],
})
export class AproveProjectsComponent implements OnInit {
  public projectsArray: Project[];
  public responsaveisArray: User[];
  public projectTable: any[] = new Array();

  constructor(private _projectService: ProjectService, private _alertService: AlertService,
     private _userService: UserService, private _authService: AuthService,
      private router: Router, private _emailService: EmailSenderService) { }

  ngOnInit(): void {
    this._authService.getRole().subscribe(res =>{
      if(res["Role"] !== "Gestor")
        this.router.navigate(['unauthorized']);
    });
    this._projectService
      .getToAproveProjects()
      .subscribe((res) => {
        this.projectsArray = res["projetos"];
        console.log(this.projectsArray);
        let responsaveisId = { users: this.projectsArray.map(project => project.responsavelId) };
        this._userService.getUsersArray(responsaveisId).subscribe(res => {
          this.responsaveisArray = res["users"];
          console.log(this.responsaveisArray);
          this.projectsArray.filter(project => this.responsaveisArray.filter(element => {
            if (element._id === project.responsavelId) {
              let nome = element.nome
              let email = element.email
              this.projectTable.push({ project, nome , email});
              console.log(this.projectTable);
            }
          }));
        });
      });
  }

  avaliarProjeto(projectId, email ,aprovacao) {
    console.log(email)
    let body = { projectId: projectId, aprovado: aprovacao };
    this._projectService.aproveProject(body).subscribe((res) => {
      if(aprovacao==="Aprovado"){
        this._emailService.sendConfirmProjectEmail(email).subscribe();        //Email here
      }
      this._alertService.success(res["msg"]);
    });
  }
}
