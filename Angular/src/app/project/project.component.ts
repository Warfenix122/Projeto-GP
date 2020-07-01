import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs'
import { startWith, map } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { FileService } from '../services/file.service';
import { FotoService } from '../services/foto.service';

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
  addContactField: boolean = false;
  newContact: { contacto: string, descricao: string } = { contacto: "", descricao: "" };

  //buttonsText
  addRemFavButtonText: string;

  //buttonSupports
  isFavProject: boolean = false;
  isEditButtonToggled: boolean = false;
  addPhotoResult: any;
  selectedPhotoFileName: string;
  selectedCoverPhotoFileName: string;
  isAddingManagers: boolean = false;

  //edit inputs readonly or not
  isProjectNameInputReadonly: boolean = true;
  isProjectSummaryInputReadonly: boolean = true;
  isProjectApplicationsCloseDateReadonly: boolean = true;
  isProjectVacanciesReadonly: boolean = true;
  isProjectNecessaryFormationsReadonly: boolean = true;
  isProjectAreasOfInterestReadonly: boolean = true;
  showEditProjectContact: boolean[] = [];

  projectPhotos: Array<any> = [];
  coverPhoto: any = '';
  isManager: boolean;
  isResponsible: boolean;
  project: Project;
  updatedProject: Project;
  id: string;
  date: string;
  role: string;
  candidato: boolean = false;
  currentUserId: String;
  user: User;
  gestores: User[];
  externos: User[];
  newContactsSession: string = "";

  constructor(private route: ActivatedRoute, private projectService: ProjectService, public datepipe: DatePipe, private renderer: Renderer2,
    private _userService: UserService, private _authService: AuthService, private iconRegistry: MatIconRegistry, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private alertService: AlertService, private router: Router, private _bottomSheet: MatBottomSheet, private fotoService: FotoService, private fileService: FileService) { }

  ngOnInit(): void {
    // - quando clica no botão eliminar, abrir um 'Dialog' para perguntar ao user se confirma a eliminação da foto ou não. E depois sim eliminar a foto. HTML Linha 213

    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.projectService.getProject(this.id).subscribe(project => {
      console.log(project.formacoesNecessarias);
      this.project = this.deepCopy(project) as Project;
      this.updatedProject = this.deepCopy(project) as Project;
      this.updatedProject.contactos.forEach((elem, index) => this.showEditProjectContact[index] = false);


      this.fotoService.geDecodedProjectFotos(project._id).then((result) => {
        if (result)
          this.projectPhotos = result;
      });


      this.fotoService.getProjectCoverPhoto(project._id).then((result) => {
        if (result) this.coverPhoto = result[0];
        console.log('coverPhoto :>> ', this.coverPhoto);
      });



      this.projectService.getGestores(this.id).subscribe(res => {
        this.gestores = res["gestores"];
        this._userService.getCurrentUserId().subscribe(res => {
          this.currentUserId = res["UserID"];
          this.isResponsible = this.project.responsavelId == this.currentUserId;
          this.isManager = this.project.gestores.includes(this.currentUserId);
          this._authService.getRole().subscribe(res => {
            this.role = res["Role"];
            if (this.project.voluntarios.filter(v => v.userId === this.currentUserId).length > 0) {
              this.candidato = true;
            }
            this._userService.getUser(this.currentUserId).subscribe((user: User) => {
              this.user = user;
              if (this.user.projetosFavoritos.find((projeto) => projeto == this.id)) {
                this.isFavProject = true;
              } else {
                this.isFavProject = false;
              }
            });
          });
          this._userService.getVoluntariosExternos().subscribe(users => {
            this.externos = users;
          });
        });
      });
    });
  }

  getSrc(foto) {
    if (foto) {
      return 'data:' + foto.contentType + ';base64,' + foto.src;
    }
    else {
      return "https://higuma.github.io/bootstrap-4-tutorial/img/286x180.svg";
    }
  }

  deepCopy(obj) {
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
      data: { contact: contact.contacto, description: contact.descricao }
    });

    dialogRef.afterClosed().subscribe(isRemove => {
      if (isRemove)
        this.updatedProject.contactos.splice(index, 1);
    });
  }

  openDeleteProjectDialog(): void {
    const dialogRef = this.dialog.open(DialogDeleteProject, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(isRemove => {
      if (isRemove)
        this.deleteProject();
    });
  }

  onFileSelected(event) {
    let files = event.target.files;

    if (files.length > 0) {
      this.selectedCoverPhotoFileName = files[0].name;

    }
    const file = files[0]

    const inputNode: any = document.querySelector('#cover');

    const formdata = new FormData();
    formdata.append('file', file, file.name);
    formdata.append('projectId', this.id);

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.addPhotoResult = e.target.result;
        console.log(e.target);
      };
      reader.onloadend = () => {
        this.fileService.updateCoverPhoto(formdata);
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }
  onFilesSelected(event) {
    let files = event.target.files;

    if (files.length > 0) {
      this.selectedPhotoFileName = files[0].name;

    }
    const file = files[0]

    const inputNode: any = document.querySelector('#file');

    const formdata = new FormData();
    formdata.append('file', file, file.name);
    formdata.append('projectId', this.id)

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.addPhotoResult = e.target.result;
        console.log(e.target);
      };
      reader.onloadend = () => {
        this.fileService.updateProjectPhotoFiles(formdata);
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  deleteCoverPhoto(coverId) {
    if (coverId)
      this.fileService.deleteProjectCover(this.id);
  }

  deletePhoto(fotoId){
    if(fotoId){
      this.fileService.deleteProjectPhoto(this.id, fotoId)
    }
  }

  openAddManagerDialog() {
    let dialogRef = this.dialog.open(DialogAddManager, {
      width: '600px',
      data: { gestores: this.gestores, externos: this.externos }
    });
    dialogRef.afterClosed().subscribe(gestores => {
      if (gestores !== undefined) {
        this.gestores = gestores;
        let gestoresId = this.gestores.map(gestor => gestor._id);
        this.projectService.editProject(this.project._id, { gestores: gestoresId }).subscribe();
      }
    })
  }

  openManageVolunteersDialog() {
    let volunteers = [];
    let usersId = [];
    this.project.voluntarios.forEach((elem) => {
      usersId.push(elem.userId);
    });
    this._userService.getUsers(usersId).subscribe((users) => {
      users.forEach((user) => {
        volunteers.push({
          _id: user._id,
          name: user.nome,
          email: user.email,
          state: this.project.voluntarios.find(elem => elem.userId == user._id).estado
        });
      })
      const dialogRef = this.dialog.open(DialogManageVolunteers, {
        width: '600px',
        data: { volunteers: volunteers }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 'back')
          this.openSettingsBottomSheet();
        else if (result != 'close')
          this.projectService.editProject(this.project._id, { voluntarios: result }).subscribe((updatedProject) => {
            this.project.voluntarios = updatedProject.voluntarios;
            this.alertService.success("Alterações aos voluntários guardadas com sucesso");
          });
      });
    })

  }

  openSettingsBottomSheet() {
    const bottomSheetRef = this._bottomSheet.open(BottomSheetSetting, {
      data: {}
    });

    bottomSheetRef.afterDismissed().subscribe(option => {
      switch (option) {
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

  showEditContact(index) {
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

  saveContactField() {
    this.addContactField = false;
    this.updatedProject.contactos.push(this.newContact);
    this.newContact = { contacto: "", descricao: "" };
  }

  cancelVolunteer() {
    this.projectService.cancelVolunteer(this.id, this.currentUserId).subscribe(res => console.log(res));
  }

  updateFavProject() {
    this.isFavProject = !this.isFavProject;
    this.addRemFavButtonText = this.isFavProject ? 'Remover dos favoritos' : 'Adicionar aos Favoritos';
    this._userService.getCurrentUserId().subscribe((res) => {
      this._userService.updateUserFavProject(this.isFavProject, res['UserID'], this.project._id).subscribe();

    })
  }

  hoverFavButton(isOver) {
    if (isOver)
      this.addRemFavButtonText = this.isFavProject ? 'Remover dos favoritos' : 'Adicionar aos Favoritos';
    else
      this.addRemFavButtonText = '';
  }

  activateEditAll() {
    this.isProjectNameInputReadonly = false;
    this.isProjectSummaryInputReadonly = false;
    this.isProjectApplicationsCloseDateReadonly = false;
    this.isProjectVacanciesReadonly = false;
    this.isProjectNecessaryFormationsReadonly = false;
    this.isProjectAreasOfInterestReadonly = false;
    this.showEditProjectContact = this.showEditProjectContact.map((elem, index) => {
      return true;
    });
  }

  editButtonClicked() {
    this.isEditButtonToggled = !this.isEditButtonToggled;
    if (this.isEditButtonToggled)
      this.openSnackBar('Para editar cada campo tem que clicar no respetivo lápis', 'Fechar', 20000);
    else {
      this.updatedProject = this.deepCopy(this.project) as Project;
      this.isProjectNameInputReadonly = true;
      this.isProjectSummaryInputReadonly = true;
      this.isProjectApplicationsCloseDateReadonly = true;
      this.isProjectVacanciesReadonly = true;
      this.isProjectNecessaryFormationsReadonly = true;
      this.isProjectAreasOfInterestReadonly = true;
      this.addPhotoResult = undefined;
      this.showEditProjectContact = this.showEditProjectContact.map((elem, index) => {
        return false;
      });
    }
  }

  saveUpdatedProject() {
    this.projectService.editProject(this.updatedProject._id, this.updatedProject).subscribe((updatedProject) => {
      this.project = this.deepCopy(updatedProject);
      this.isEditButtonToggled = !this.isEditButtonToggled;
      this.alertService.success("Projeto atualizado com sucesso");
    });
  }

  deleteProject() {
    this.projectService.deleteProject(this.project._id).subscribe((deletedProject) => {
      this.router.navigate(['/projects']);
      this.alertService.success("Projeto eliminado com sucesso");
    })
  }

  readonlyInput(input) {
    switch (input) {
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onClose(isRemove) {
    this.dialogRef.close(isRemove);
  }
}

@Component({
  selector: 'dialog-delete-project',
  templateUrl: 'dialog-delete-project.html',
})
export class DialogDeleteProject {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteProject>) { }

  onClose(isRemove) {
    this.dialogRef.close(isRemove);
  }
}

@Component({
  selector: 'dialog-manage-volunteers',
  templateUrl: 'dialog-manage-volunteers.html',
})
export class DialogManageVolunteers {
  filteredNames: Observable<String[]>;
  names: string[];
  nameFilter = new FormControl('', Validators.required);
  volunteers: { _id: string, name: string, email: string, state: string, show: boolean }[];
  filteredVolunteers: Observable<{}[]>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogManageVolunteers>) {
    this.names = this.data.volunteers.map(volunteer => volunteer.name);
    this.volunteers = data.volunteers;
  }

  ngOnInit(): void {
    this.filteredNames = this.nameFilter.valueChanges
      .pipe(
        startWith(''),
        map(val => this._filterEmails(val))
      )
    this.filteredVolunteers = this.nameFilter.valueChanges
      .pipe(
        startWith(''),
        map(val => this._filterVolunteers(val))
      )
  }

  getBackgroundColor(state) {
    let res = "border-radius: 5px; ";
    if (state == 'Aprovado')
      return res + "background-color: #e6ffe6;"
    if (state == 'Recusado')
      return res + "background-color: #ffe6e6;"
    return res;
  }

  private _filterVolunteers(value: string): {}[] {
    const filterValue = value.toLowerCase();
    return this.volunteers.filter((option, index) => {
      return option.name.toLowerCase().includes(filterValue);
    });
  }

  private _filterEmails(value: string): String[] {
    const filterValue = value.toLowerCase();
    return this.names.filter(option => option.toLowerCase().includes(filterValue));
  }

  approveVolunteer(i) {
    this.volunteers[i].state = 'Aprovado';
  }

  disapproveVolunteer(i) {
    this.volunteers[i].state = 'Recusado';
  }

  removeVolunteer(index) {
    this.volunteers.splice(index, 1);
    this.filteredVolunteers = this.filteredVolunteers.pipe(
      startWith(''),
      map(() => this._filterVolunteers(this.nameFilter.value))
    );
  }

  onClose(state) {
    if (state == 'save')
      this.dialogRef.close(this.volunteers.map(elem => { return { userId: elem._id, estado: elem.state } }));
    else
      this.dialogRef.close(state);
  }
}

@Component({
  selector: 'bottom-sheet-settings',
  templateUrl: 'bottom-sheet-settings.html'
})
export class BottomSheetSetting {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetSetting>) { }

  closeSettings(option) {
    this._bottomSheetRef.dismiss(option);
    event.preventDefault();
  }
}

@Component({
  selector: 'dialog-add-manager',
  templateUrl: 'dialog-add-manager.html',
})
export class DialogAddManager {
  filteredEmails: Observable<String[]>;
  emails: string[];
  inputtedEmail = new FormControl('', Validators.required);
  gestores: User[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogAddManager>) {
    this.emails = this.data.externos.map(externo => externo.email);
    this.gestores = data.gestores;
  }

  ngOnInit(): void {
    this.gestores.forEach(email => this.emails.includes)
    this.filteredEmails = this.inputtedEmail.valueChanges
      .pipe(
        startWith(''),
        map(val => this._filterEmails(val))
      )
  }

  onSearchChange(searchValue: string): void {
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

  addGestor() {
    if (this.inputtedEmail.valid) {
      let addedGestor = this.data.externos.filter(externo => externo.email === this.inputtedEmail.value)[0];
      if (!this.gestores.includes(addedGestor))
        this.gestores.push(addedGestor);
    }
  }

  removeGestor(index) {
    this.gestores.splice(index, 1);
  }

  onClose(isAdded) {
    if (isAdded) {
      this.emails.push(this.inputtedEmail.value);
      this.dialogRef.close(this.gestores);
    } else {
      this.dialogRef.close();
    }
  }
}
