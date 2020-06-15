import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { Project } from 'models/projeto';
import { ThrowStmt } from '@angular/compiler';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-favorite-project',
  templateUrl: './favorite-project.component.html',
  styleUrls: ['./favorite-project.component.css']
})
export class FavoriteProjectComponent implements OnInit {
  projects: Array<Project>;
  noProjects = false;
  constructor(private projectService: ProjectService, private _alertService: AlertService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      const user = res['user'];
      this.projectService.userFavoriteProjects(user._id).subscribe(projects => {
        if(projects){
          this.projects = projects;
        }else{
          this.noProjects= true;
        }
      });
    });
  }
  openProject(index) {
    let projectId = this.projects[index]._id;
    this.projectService.getProject(projectId).subscribe(project => {
      //navigate to the project page passing the 'project' value
    })
  }
}
