import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'models/projeto';
import { ProjectService } from '../services/project.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Foto } from 'models/foto';
import { FotoService } from '../services/foto.service';
import { FileService } from '../services/file.service';


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
  fotos: Array<any> = [];
  cover: any;
  constructor(private route: ActivatedRoute, private fotoService: FotoService, private fileService: FileService, private projectService: ProjectService, public datepipe: DatePipe, private _userService: UserService, private _authService: AuthService) { }

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
      this.fotoService.geDecodedProjectFotos(this.project._id).then((fotos) => { this.fotos = fotos })
      this.fotoService.getDecodedFotos(this.project.fotoCapaId, 'projects').then((fotoCapa) => {
        console.log('fotoCapa :>> ', fotoCapa);
        this.fotos.push(fotoCapa);
      })
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



  volunteer() {
    this.projectService.volunteer(this.id, this.currentUserId).subscribe(res => {
      console.log(res);
    });
  }

  cancelVolunteer() {
    this.projectService.cancelVolunteer(this.id, this.currentUserId).subscribe(res => console.log(res));
  }
}
