import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { Project } from 'models/projeto';
import { ThrowStmt, NONE_TYPE } from '@angular/compiler';
import { Observable } from 'rxjs';
import { ShowHideAnimation } from '../animations/animateForm';
import { FotoService } from '../services/foto.service';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import statics from '../../assets/statics.json';
import { Foto } from 'models/foto';
import { filter } from 'rxjs/operators';
import { $ } from 'protractor';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css'],
  animations: [ShowHideAnimation],
  providers: [NgbPopoverConfig]
})
export class ListProjectsComponent implements OnInit {
  //keywords
  keyWordsBadges: Array<string> = [];
  keyWordPopoverState: string = 'hide';
  keywordInputValue: string = "";

  //aresOfInterest
  areasOfInterest: Array<{area: string, checked: boolean}> = new Array();
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
  filteredProjects: Array<Project> = [];
  fotos: Array<any> = [];

  constructor(private projectService: ProjectService, private _alertService: AlertService, private fotoService: FotoService, ngbPopoverConfig: NgbPopoverConfig, private userService: UserService) {
    ngbPopoverConfig.autoClose = 'outside';
  }

  ngOnInit(): void {
    statics.areas.forEach(elem => {
      this.areasOfInterest.push({area: elem, checked: false})
    });
    this.projectService.projects().subscribe(projects => {
      this.projects = this.filteredProjects = projects;
      this.fotoService.getAllDecodedProjectFotos().then((fotos) => { //fotos = [{id, src, contentType}]
        this.fotos = fotos;
      });
      this.userService.getCurrentUserId().subscribe(res => {
        this.userService.getUser(res["UserID"]).subscribe(user => {
          this.userRole = user.tipoMembro;
        })
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

  focusFilter(){
    this.filterFocused = !this.filterFocused;
    if(this.filterFocused){
      this.filterState = 'show';
      this.iconFilterClass = "fas fa-times-circle";
    } else {
      this.filterState = 'hide';
      this.iconFilterClass = "fas fa-filter";
      document.getElementById("buttonFilter").blur();
    }
  }

  addKeywordBadge(){
    let lastIndex = this.keywordInputValue.length - 1;
    let lastChar = this.keywordInputValue.charAt(lastIndex);
    if(lastChar == ','){
      let insertedKeyWord = this.keywordInputValue.slice(0, lastIndex);
      this.keyWordsBadges.push(insertedKeyWord);
      this.keywordInputValue = "";
    }
  }

  removeKeywordBadge(keyword){
    let index = this.keyWordsBadges.indexOf(keyword);
    this.keyWordsBadges.splice(index, 1);
  }

  clickAreaOfInterest(areaOfInterest, index){
    let selectedIndex = 0;
    let hasAreaOfInterest = this.areasOfInterestSelected.find((areaOfInterestSelected, i) =>{
      if(areaOfInterestSelected == areaOfInterest){
        selectedIndex = i;
        return true;
      }
    });
    if(!hasAreaOfInterest){
      this.areasOfInterestSelected.push(areaOfInterest);
      this.areasOfInterest[index].checked = true;
    } else {
      this.areasOfInterestSelected.splice(selectedIndex, 1);
      this.areasOfInterest[index].checked = false;
    }
  }

  hasAtLeastOneKeyword(arr: Array<{nome:String}>){
    return this.keyWordsBadges.find(keywordBadge => {
      return arr.find(projectKeyWord => {
        return projectKeyWord.nome.includes(keywordBadge);
      })
    });
  }

  hasAtLeastOneAreaOfInterest(arr: Array<String>){
    return this.areasOfInterestSelected.find(areaOfInterest => {
      return arr.find(projectAreaOfInterest => {
        return projectAreaOfInterest.includes(areaOfInterest);
      })
    });
  }

  applyFilters(){
    if(this.projectNameInputValue != "" || this.durationInputValue != "" || this.keyWordsBadges.length > 0 || this.areasOfInterestSelected.length > 0){
      this.filteredProjects = this.projects.filter(project => {
        if((project.nome != undefined && this.projectNameInputValue != "" && project.nome.toLocaleLowerCase().includes(this.projectNameInputValue.toLowerCase())) ||
          (project.XemXTempo != undefined && this.durationInputValue != "" && project.XemXTempo.toLocaleLowerCase().includes(this.durationInputValue.toLowerCase())) ||
          (this.hasAtLeastOneKeyword(project.palavrasChave)) ||
          (this.hasAtLeastOneAreaOfInterest(project.areasInteresse))){
            return true;
        }
      });
    } else {
      this.filteredProjects = this.projects;
    }
  }

  clearFilters(){
    this.filteredProjects = this.projects;
    this.projectNameInputValue = this.keywordInputValue = this.durationInputValue = "";
    this.keyWordsBadges = [];
    this.areasOfInterestSelected = [];
    this.areasOfInterest.forEach(elem => {
      if(elem.checked)
        elem.checked = false;
    })
  }

  hoverFilterButton(isOver){
    if(isOver)
      this.filterText = "Filtros";
    else if(!isOver && !this.filterFocused)
      this.filterText = "";
  }
}
