import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { Project } from 'models/projeto';
import { ThrowStmt } from '@angular/compiler';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-favorite-project',
  templateUrl: './favorite-project.component.html',
  styleUrls: ['./favorite-project.component.css']
})
export class FavoriteProjectComponent implements OnInit {
  projects: Array<Project> = [];
  fotos: Array<any> = [];

  constructor(private projectService: ProjectService, private fotoService: FotoService, private _alertService: AlertService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      const user = res['user'];
      this.projectService.userFavoriteProjects(user._id).subscribe(projects => {
        projects.forEach(element => {
          this.projectService.getProject(element).subscribe((elem) => {
            this.projects.push(elem);
          });
          this.fotoService.getAllDecodedProjectFotos().then((fotos) => {
            this.fotos = fotos;
          });
        });

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

  openProject(index) {
    let projectId = this.projects[index]._id;
    this.projectService.getProject(projectId).subscribe(project => {
      //navigate to the project page passing the 'project' value
    })
  }
}
