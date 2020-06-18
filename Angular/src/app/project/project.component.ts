import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'models/projeto';
import { ProjectService } from '../services/project.service';
import { ShowHideAddFavProjectAnimation } from '../animations/showHideAddFavProjectTextAnimation'
import { DatePipe } from '@angular/common';


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

  constructor(private route: ActivatedRoute, private projectService: ProjectService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];

    });
    this.projectService.getProject(this.id).subscribe(project => {
      this.project = project;
     
      console.log(this.date);
    });
  }

  

}
