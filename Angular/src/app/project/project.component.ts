import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'models/projeto';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from 'models/utilizadores';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from '../services/alert.service';
import {MatBottomSheet,MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Observable} from 'rxjs'
import { startWith, map } from 'rxjs/operators';
import {FormControl,Validators} from '@angular/forms';

export interface DialogData {
  contact: string;
  description: string;
}
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [DatePipe]
  })

export class ProjectComponent implements OnInit {
  //Others
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  showEditProjectContact: boolean[] = [];
  addContactField: boolean = false;
  newContact: {contacto: string, descricao: string} = {contacto: "", descricao: ""};

  //buttonsText
  addRemFavButtonText: string;

  //buttonSupports
  isFavProject: boolean = false;
  isEditButtonToggled: boolean = false;
  isAddingManagers: boolean = false;

  //edit inputs readonly or not
  isProjectNameInputReadonly: boolean = true;
  isProjectSummaryInputReadonly: boolean = true;
  isProjectApplicationsCloseDateReadonly: boolean = true;
  isProjectVacanciesReadonly: boolean = true;
  isProjectNecessaryFormationsReadonly: boolean = true;
  isProjectAreasOfInterestReadonly: boolean = true;

  isManagerOrResponsible: boolean;
  project: Project;
  updatedProject: Project;
  id: string;
  date: string;
  role: string;
  candidato: boolean = false;
  currentUserId: String;
  user : User;
  gestores: User[];
  externos: User[];

  newContactsSession: string = "";

  constructor(private route: ActivatedRoute, private projectService: ProjectService, public datepipe: DatePipe, private renderer: Renderer2,
              private _userService: UserService, private _authService: AuthService, private iconRegistry: MatIconRegistry, private _snackBar: MatSnackBar,
              public dialog: MatDialog, private alertService: AlertService, private _bottomSheet:MatBottomSheet) { }

    ngOnInit(): void {
      this.route.params.subscribe((params) => {
        this.id = params['id'];

      });
      this.projectService.getProject(this.id).subscribe(project => {
        this.project = this.deepCopy(project) as Project;
        this.updatedProject = this.deepCopy(project) as Project;
        this.updatedProject.contactos.forEach((elem, index) => this.showEditProjectContact[index] = false);

        this.projectService.getGestores(this.id).subscribe(res=>{
          this.gestores = res["gestores"];
          this._userService.getCurrentUserId().subscribe(res => {
            this.currentUserId = res["UserID"];
            this.isManagerOrResponsible = (this.project.responsavelId == this.currentUserId || this.project.gestores.includes(this.currentUserId));
            this._authService.getRole().subscribe(res =>{
              this.role = res["Role"];
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
              });
            });
            this._userService.getVoluntariosExternos().subscribe(users=>{
              this.externos = users;
            });
          });
        });
      });
    }

    deepCopy(obj){
      var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
        }
        return copy;
    }
    }

    openSnackBar(message: string, action: string, duration: number) {
      this._snackBar.open(message, action, {
        duration: duration,
      });
    }

    openRemoveContactDialog(index): void {
      let contact = this.updatedProject.contactos[index];
      const dialogRef = this.dialog.open(DialogRemoveContact, {
        width: '400px',
        data: {contact: contact.contacto, description: contact.descricao}
      });

      dialogRef.afterClosed().subscribe(isRemove => {
        if(isRemove)
          this.updatedProject.contactos.splice(index, 1);
      });
    }

    openDeleteProjectDialog(): void {
      const dialogRef = this.dialog.open(DialogRemoveContact, {
        width: '400px',
        data: {}
      });

      dialogRef.afterClosed().subscribe(isRemove => {
        if(isRemove)
          this.deleteProject();
      });
    }

    openAddManagerDialog(){
      let dialogRef = this.dialog.open(DialogAddManager,{
        width: '600px',
        data:{gestores:this.gestores, externos: this.externos}
      });
      dialogRef.afterClosed().subscribe(gestores => {
        if(gestores !== undefined){
          this.gestores = gestores;{}
          let gestoresId = this.gestores.map(gestor=> gestor._id);
          this.projectService.editProject(this.project._id,{gestores:gestoresId}).subscribe();
        }
      })
    }

    openManageVolunteersDialog(){
      const dialogRef = this.dialog.open(DialogManageVolunteers, {
        width: '900px',
        data: {volunteers: this.project.voluntarios}
      });

      dialogRef.afterClosed().subscribe(volunteers => {
        
      });
    }

    openSettingsBottomSheet(){
      const bottomSheetRef = this._bottomSheet.open(BottomSheetSetting, {
        data:{}
      });

      bottomSheetRef.afterDismissed().subscribe(option => {
        switch(option){
          case "managers":
            this.openAddManagerDialog();
            break;
          case "volunteers":
            this.openManageVolunteersDialog();
            break;
        }
      })
  }

    volunteer() {
      this.projectService.volunteer(this.id, this.currentUserId).subscribe(res => {
        console.log(res);
      });
    }

    removeNecessaryFormation(formation: string): void {
      const index = this.updatedProject.formacoesNecessarias.indexOf(formation);

      if (index >= 0) {
        this.updatedProject.formacoesNecessarias.splice(index, 1);
      }
    }

    removeAreaOfInterest(areaOfInterest: string): void {
      const index = this.updatedProject.areasInteresse.indexOf(areaOfInterest);

      if (index >= 0) {
        this.updatedProject.areasInteresse.splice(index, 1);
      }
    }

    showEditContact(index){
      this.showEditProjectContact[index] = !this.showEditProjectContact[index];
    }

    addNecessaryFormation(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;

      // Add formation
      if ((value || '').trim()) {
        this.updatedProject.formacoesNecessarias.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }

    addAreaOfInterest(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;

      // Add formation
      if ((value || '').trim()) {
        this.updatedProject.areasInteresse.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }

    saveContactField(){
      this.addContactField = false;
      this.updatedProject.contactos.push(this.newContact);
      this.newContact = {contacto: "", descricao: ""};
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
      if(this.isEditButtonToggled)
        this.openSnackBar('Para editar cada campo tem que clicar no respetivo lápis', 'Fechar', 20000);
      else
        this.updatedProject = this.deepCopy(this.project) as Project;
    }

    saveUpdatedProject(){
      this.projectService.editProject(this.updatedProject._id, this.updatedProject).subscribe((updatedProject) => {
        this.project = this.deepCopy(updatedProject);
        this.isEditButtonToggled = !this.isEditButtonToggled;
        this.alertService.success("Projeto atualizado com sucesso");
      });
    }

    deleteProject(){
      //Service delete project
    }

    readonlyInput(input){
      switch(input){
        case "projectName":
          this.isProjectNameInputReadonly = !this.isProjectNameInputReadonly;
          break;
        case "projectSummary":
          this.isProjectSummaryInputReadonly = !this.isProjectSummaryInputReadonly;
          break;
        case "projectApplicationsCloseDate":
          this.isProjectApplicationsCloseDateReadonly = !this.isProjectApplicationsCloseDateReadonly;
          break;
        case "projectVacancies":
          this.isProjectVacanciesReadonly = !this.isProjectVacanciesReadonly;
          break;
        case "projectNecessaryFormations":
          this.isProjectNecessaryFormationsReadonly = !this.isProjectNecessaryFormationsReadonly;
          break;
        case "projectAreasOfInterest":
          this.isProjectAreasOfInterestReadonly = !this.isProjectAreasOfInterestReadonly
          break;
      }
    }
}

@Component({
  selector: 'dialog-remove-contact',
  templateUrl: 'dialog-remove-contact.html',
})
export class DialogRemoveContact {
  constructor(
    public dialogRef: MatDialogRef<DialogRemoveContact>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData){}

  onClose(isRemove){
    this.dialogRef.close(isRemove);
  }
}

@Component({
  selector: 'dialog-delete-project',
  templateUrl: 'dialog-delete-project.html',
})
export class DialogDeleteProject {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteProject>){}

  onClose(isRemove){
    this.dialogRef.close(isRemove);
  }
}

@Component({
  selector: 'dialog-manage-volunteers',
  templateUrl: 'dialog-manage-volunteers.html',
})
export class DialogManageVolunteers {
  constructor(
    public dialogRef: MatDialogRef<DialogManageVolunteers>){}

  onClose(isRemove){
    this.dialogRef.close(isRemove);
  }
}

@Component({
  selector: 'bottom-sheet-settings',
  templateUrl: 'bottom-sheet-settings.html'
})
export class BottomSheetSetting{
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetSetting>){}

  closeSettings(option){
    this._bottomSheetRef.dismiss(option);
    event.preventDefault();
  }
}

@Component({
  selector: 'dialog-add-manager',
  templateUrl: 'dialog-add-manager.html',
})
export class DialogAddManager{
  filteredEmails: Observable<String[]>;
  emails: string[];
  inputtedEmail= new FormControl('',Validators.required);
  gestores: User[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<DialogAddManager>){
    this.emails = this.data.externos.map(externo=>externo.email);
    this.gestores = data.gestores;
  }

  ngOnInit():void{
    this.gestores.forEach(email=>  this.emails.includes)
    this.filteredEmails= this.inputtedEmail.valueChanges
      .pipe(
        startWith(''),
        map(val=> this._filterEmails(val))
      )
  }

  onSearchChange(searchValue: string): void{
    this.filteredEmails.pipe(
      startWith(''),
      map(value => this._filterEmails(searchValue))
    );

    console.log(this.emails.indexOf(searchValue));
  }

  private _filterEmails(value: string): String[] {
    const filterValue = value.toLowerCase();
    return this.emails.filter(option => option.toLowerCase().includes(filterValue));
  }

  addGestor(){
    if(this.inputtedEmail.valid){
      let addedGestor = this.data.externos.filter(externo=> externo.email === this.inputtedEmail.value)[0];
      if(!this.gestores.includes(addedGestor))
        this.gestores.push(addedGestor);
    }
  }

  removeGestor(index){
    this.gestores.splice(index,1);
  }

  onClose(isAdded){
    if(isAdded){
      this.emails.push(this.inputtedEmail.value);
      this.dialogRef.close(this.gestores);
    }else{
      this.dialogRef.close();
    }

  }
}
