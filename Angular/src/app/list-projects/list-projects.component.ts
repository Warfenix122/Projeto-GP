import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { Project } from 'models/projeto';
import { ThrowStmt } from '@angular/compiler';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {
  projects: Array<Project>;

  constructor(private projectService: ProjectService, private _alertService: AlertService) { }

  ngOnInit(): void {
    this.projectService.projects().subscribe(projects => {
      this.projects = projects;
    });
  }

  openProject(index) {
    let projectId = this.projects[index]._id;
    this.projectService.getProject(projectId).subscribe(project => {
      //navigate to the project page passing the 'project' value
    })
  }
}
