import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'models/projeto';
import { ProjectService } from '../services/project.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [DatePipe]
})
export class ProjectComponent implements OnInit {

  project: Project;
  id: string;
  date: string;
  role: string;
  candidato: boolean = false;
  currentUserId: String;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, public datepipe: DatePipe, private _userService: UserService, private _authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];

    });
    this.projectService.getProject(this.id).subscribe(project => {
      this.project = project;
      this._userService.getCurrentUserId().subscribe(res => {
        this.currentUserId = res["UserID"];
        this.role = this._authService.getRole();
        console.log(this.project);
        if (this.project.voluntarios.filter(v => v === this.currentUserId).length > 0) {
          this.candidato = true;
        }
      });
    });
  }

  volunteer() {
    this.projectService.volunteer(this.id, this.currentUserId).subscribe(res => {
      console.log(res);
    });
  }

  cancelVolunteer(){
    this.projectService.cancelVolunteer(this.id,this.currentUserId).subscribe(res => console.log(res));
  }
}
