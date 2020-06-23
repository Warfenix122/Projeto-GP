import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'models/projeto';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from 'models/utilizadores';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [DatePipe]
  })
export class ProjectComponent implements OnInit {
  //buttonsText
  addRemFavButtonText: string;
  editButtonText: string = "Editar";

  //buttonSupports
  isFavProject: boolean = false;
  isEditButtonToggled: boolean = false;
  editIconClass: string = 'fas fa-edit';

  //edit inputs values
  projectNameInput: String;

  //edit inputs readonly or not
  isProjectNameInputReadonly: boolean = true;

  isManagerOrResponsible: boolean;
  project: Project;
  id: string;
  date: string;
  role: string;
  candidato: boolean = false;
  currentUserId: String;
  user : User;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, public datepipe: DatePipe, private _userService: UserService, private _authService: AuthService) { }

    ngOnInit(): void {
      this.route.params.subscribe((params) => {
        this.id = params['id'];

      });
      this.projectService.getProject(this.id).subscribe(project => {
        this.project = project;

        this.projectNameInput = this.project.nome;
        this._userService.getCurrentUserId().subscribe(res => {
          this.currentUserId = res["UserID"];
          this.isManagerOrResponsible = (this.project.responsavelId == this.currentUserId || this.project.gestores.find((gestorId) => gestorId.gestorId == this.currentUserId) != undefined);
          this.role = this._authService.getRole();
          if (this.project.voluntarios.filter(v => v === this.currentUserId).length > 0) {
            this.candidato = true;
          }
          this._userService.getUser(this.currentUserId).subscribe((user: User) => {
            this.user = user;
            if(this.user.projetosFavoritos.find((projeto) => projeto == this.id)){
              this.isFavProject = true;
          }else{
              this.isFavProject = false;
          }
          })
          
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
    updateFavProject(){
      this.isFavProject = !this.isFavProject;
      this.addRemFavButtonText = this.isFavProject ? 'Remover dos favoritos' : 'Adicionar aos Favoritos';
      this._userService.updateUserFavProject(this.isFavProject, this.user._id, this.project._id).subscribe();
    }

    hoverFavButton(isOver){
      if(isOver)
        this.addRemFavButtonText = this.isFavProject ? 'Remover dos favoritos' : 'Adicionar aos Favoritos';
      else
        this.addRemFavButtonText = '';
    }

    editButtonClicked(){
      this.isEditButtonToggled = !this.isEditButtonToggled;
      if(this.isEditButtonToggled){
        this.editIconClass = 'fas fa-times';
        this.editButtonText = 'Cancelar';
      } else {
        this.editIconClass = 'fas fa-edit';
        this.editButtonText = 'Editar';
      }
    }

    readonlyInput(input){
      switch(input){
        case "projectName": 
          this.isProjectNameInputReadonly = !this.isProjectNameInputReadonly;
          break;
      }
    }
}

  


