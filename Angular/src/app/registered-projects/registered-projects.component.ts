import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { Project } from 'models/projeto';
import { ThrowStmt } from '@angular/compiler';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { FotoService } from '../services/foto.service';
@Component({
  selector: 'app-registered-projects',
  templateUrl: './registered-projects.component.html',
  styleUrls: ['./registered-projects.component.css']
})
export class RegisteredProjectsComponent implements OnInit {
  projects: Array<Project> = [];
  fotos: Array<any> = [];

  constructor(private projectService: ProjectService, private fotoService: FotoService, private _alertService: AlertService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      const user = res['user'];
      this.projectService.userRegisterProjects(user._id).subscribe(projects => {
        if (projects) {
          projects.forEach(element => {
            console.log('element :>> ', element['projetoId']);
            this.projectService.getProject(element['projetoId']).subscribe((elem) => {
              if (elem) { this.projects.push(elem); }
            });

          });
        }

      });
    });
  }

  getSrc(fotoId) {
    const foto = this.fotos.find(elem => elem.id == fotoId);
    if (foto) {
      return 'data:' + foto.contentType + ';base64,' + foto.src;
    }
    else {
      return "https://higuma.github.io/bootstrap-4-tutorial/img/286x180.svg";
    }
  }

}
