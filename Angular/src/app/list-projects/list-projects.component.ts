import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { Project } from 'models/projeto';
import { ThrowStmt } from '@angular/compiler';
import { Observable } from 'rxjs';
import { FotoService } from '../services/foto.service';
import { Foto } from 'models/foto';

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {
  @Input() 

  projects: Array<Project> = [];
  fotos: Array<any> = [];

  constructor(private projectService: ProjectService, private _alertService: AlertService, private fotoService: FotoService) { }

  ngOnInit(): void {
    this.projectService.projects().subscribe(projects => {
      this.projects = projects;
      this.fotoService.getAllDecodedProjectFotos().then((fotos) => { //fotos = [{id, src, contentType}]
        this.fotos = fotos;
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
