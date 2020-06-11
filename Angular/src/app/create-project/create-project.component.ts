import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import statics from '../../assets/statics.json';
import { UserService } from '../services/user.service';
import { User } from '../../../models/utilizadores';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _moment from 'moment';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})
export class CreateProjectComponent implements OnInit {
  formacoesNecessarias: string[] = new Array();
  minDate =  new Date();
  areas: Array<String> = statics.areas;
  selectedAreas: Array<String>;
  utilizadoresExternos: User[] = new Array();
  emails: string[];
  filteredEmails: Observable<String[]>
  gestores: User[] = new Array();
  emailsAdicionados: string[];

  constructor(private _fb: FormBuilder, private _userService: UserService) { }

  formInfo = this._fb.group({
    nome: new FormControl(''),
    resumo: new FormControl(''),
    vagas: new FormControl(''),
    necessarioFormacao: new FormControl(false),
    formacao: new FormControl(''),
    areasInteresse: this.addAreasInteresseControls(),
    gestoresId: new FormControl(''),
  });

  formDatas = this._fb.group({
    recorrente: new FormControl(false),
    XemXtempo1: new FormControl(''),
    XemXtempo2: new FormControl(''),
    atividades: [{ descricao: String, dataAcontecimento: Date }], //já vejo
    dataTermino: new FormControl(''),
    dataFechoInscricoes: new FormControl(''),
    dataComeco: new FormControl(''),
  });

  ngOnInit(): void {
    this._userService.getVoluntariosExternos().subscribe(users => {
      this.utilizadoresExternos = users;
      this.emails = this.utilizadoresExternos.map(user => user.email);
      this.filteredEmails = this.formInfo.get('gestoresId').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterUtilizadores(value))
        );
    });
  }

  private _filterUtilizadores(value: string): String[] {
    const filterValue = value.toLowerCase();
    return this.emails.filter(option => option.toLowerCase().includes(filterValue));
  }

  gestoresEscolhidos() {
    let user = this.utilizadoresExternos.find(user => user.email == this.gestorEmail.value)
    this.gestores.push(user);
  }

  addAreasInteresseControls() {
    const arr = this.areas.map(element => {
      return this._fb.control(false);
    });
    return this._fb.array(arr);
  }

  get isFormacaoNecessaria() {
    return this.formInfo.get("necessarioFormacao");
  }

  get formacao() {
    return this.formInfo.get("formacao");
  }

  get gestorEmail() {
    return this.formInfo.get("gestoresId");
  }

  get recorrente(){
    return this.formDatas.get("recorrente");
  }

  get XemXtempo1(){
    return this.formDatas.get("XemXtempo1");
  }

  get XemXtempo2(){
    return this.formDatas.get("XemXtempo2");
  }

  addFormacao() {
    if (this.formacao.value || this.formacao.value !== "")
      this.formacoesNecessarias.push(this.formacao.value);
  }

  getSelectedAreas() {
    this.selectedAreas = [];
    this.areasArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedAreas.push(this.areas[i]);
      }
    });
  }

  get areasArray() {
    return <FormArray>this.formInfo.get('areasInteresse');
  }

  postData() {
    let userId = this._userService.getCurrentUserId(localStorage.getItem('token'));
    console.log(userId);
    let XemXtempo = this.XemXtempo1 + " em "+ this.XemXtempo2;

  }

}
