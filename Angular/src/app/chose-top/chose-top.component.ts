import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import statics from '../../assets/statics.json';
import { Project } from 'models/projeto';
import { AlertService } from '../services/alert.service';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../services/project.service';
import { FotoService } from '../services/foto.service';
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chose-top',
  templateUrl: './chose-top.component.html',
  styleUrls: ['./chose-top.component.css']
})
export class ChoseTopComponent implements OnInit {

  //keywords
  keyWordsBadges: Array<string> = [];
  keyWordPopoverState: string = 'hide';
  keywordInputValue: string = "";

  //aresOfInterest
  areasOfInterest: Array<{ area: string, checked: boolean }> = new Array();
  areasOfInterestSelected: Array<string> = [];

  //otherInputs
  projectNameInputValue: string = "";
  durationInputValue: string = "";

  //filter
  filterText: string;
  filterFocused: boolean = false;
  iconFilterClass: string = "fas fa-filter";
  applyFilterButtonDisabled: boolean = true;
  applyFilterButtonCursor: string = 'default';

  //animations
  filterState: string = 'hide';

  projectRoute: string = '';
  userRole: any;
  projects: Array<Project> = [];
  toptop: Array<Project> = [];
  fotos: Array<any> = [];
  topProjects: Array<Project> = [];
  itemsTable: Array<Project[]>;

  @ViewChild('todoList') topList: ElementRef;

  constructor(private projectService: ProjectService, private _alertService: AlertService, private fotoService: FotoService,
    ngbPopoverConfig: NgbPopoverConfig, private userService: UserService,
    private router: Router) {
    ngbPopoverConfig.autoClose = 'outside';
  }

  ngOnInit(): void {
    statics.areas.forEach(elem => {
      this.areasOfInterest.push({ area: elem, checked: false })
    });
    this.projectService.projects().subscribe(projects => {
      this.projects = projects.filter((elem) => {
        console.log('elem :>> ', elem);
        if (!elem.projetoMes.state) {
          return elem
        }
      });
      this.fotoService.getAllDecodedProjectFotos().then((fotos) => { //fotos = [{id, src, contentType}]
        this.fotos = fotos;
      });
      this.userService.getCurrentUserId().subscribe(res => {
        this.userService.getUser(res["UserID"]).subscribe(user => {
          this.userRole = user.tipoMembro;
        })
      })

      this.topProjects = projects.filter((elem) => {
        if (elem.projetoMes.state) {
          return elem;
        }
      });

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


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  saveTop() {
    if (this.topProjects.length <= 3) {
      this.projects.forEach((elem) => {
        this.projectService.dismarkAsTop(elem._id).subscribe((res) => { });
      });
      this.topProjects.forEach((element, i, arr) => {
        this.projectService.getProject(element._id).subscribe((proj) => {
          this.projectService.markAsTop(proj._id, i + 1).subscribe((res) => {
            this._alertService.success(res["msg"]);
            this.router.navigate(['']);
          }, err => {
            this._alertService.error(err["error"].msg);
          });
        }, err => {
          this._alertService.error(err["error"].msg);
        });
      });
    } else {
      this._alertService.error("Só pode guardar 3 projetos");
    }
  }

}

