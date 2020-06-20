import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'models/projeto';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { ShowHideAddFavProjectAnimation } from '../animations/showHideAddFavProjectTextAnimation'
import { DatePipe } from '@angular/common';
import { User } from 'models/utilizadores';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [DatePipe],
  animations: [ShowHideAddFavProjectAnimation]
})
export class ProjectComponent implements OnInit {
  showHideAddFavProjectState: string = "hide";

  project: Project;
  id: string;
  date : string;
  user : User;
  star: boolean = false;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, public datepipe: DatePipe, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];

    });
    this.projectService.getProject(this.id).subscribe(project => {
      this.project = project;
     
      
    });
    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      this.user = res['user']
    });
  }

  addToFavProject(){
    if(this.star == false){
      this.star = true;
    } else {
      this.star = false;
    }
    this.projectService.addFavProject(this.user._id, this.id);
  }
}

  


