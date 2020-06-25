import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'models/projeto';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { ShowHideAddFavProjectAnimation } from '../animations/showHideAddFavProjectTextAnimation'
import { DatePipe } from '@angular/common';
import { User } from 'models/utilizadores';

import {MenuItem} from 'primeng/api';


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
  date : string;
  user : User;
  isFavProject: boolean = false;

  responsiveOptions;


  constructor(private route: ActivatedRoute, private projectService: ProjectService, public datepipe: DatePipe, private userService: UserService) {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
   }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let id = params['id'];

      this.projectService.getProject(id).subscribe(project => {
        this.project = project;

        this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
          this.user = res['user'];
          if(this.user.projetosFavoritos.find((projeto) => projeto == id))
            this.isFavProject = true;
          else
            this.isFavProject = false;
        });
      });
    });


  }

  updateFavProject(){
    this.isFavProject = !this.isFavProject;
    this.userService.updateUserFavProject(this.isFavProject, this.user._id, this.project._id).subscribe();
  }
  

  
 
}

  


