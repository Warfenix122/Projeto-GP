import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import statics from '../../assets/statics.json';
import { UserService } from '../services/user.service';
import { User } from '../../../models/utilizadores';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _moment from 'moment';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service'
import { ProjetoResponse } from 'models/responseInterfaces';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})

export class CreateProjectComponent implements OnInit {
  formacoesNecessarias: string[] = new Array();
  formacoes: Array<String> = statics.fomação;
  minDate = new Date();
  areas: Array<String> = statics.areas;
  selectedAreas: Array<String>;
  utilizadoresExternos: User[] = new Array();
  emails: string[];
  filteredEmails: Observable<String[]>
  gestores: User[] = new Array();
  emailsAdicionados: any[] = new Array();
  daysBetween: Date[] = new Array();
  comeco: Date;
  termino: Date;
  _datesSet: Boolean = false;
  file: File = null;
  formErrors: [];
  validationMessages: [String];


  constructor(private _fb: FormBuilder, private _userService: UserService, private _alertService: AlertService, private _projectService: ProjectService, private _authService: AuthService) { }

  formInfo = this._fb.group({
    nome: new FormControl('', [Validators.required]),
    resumo: new FormControl('', [Validators.required]),
    nrVagas: new FormControl('', [Validators.required]),
    necessarioFormacao: new FormControl(false),
    formacao: new FormControl(''),
    areas: this.addAreasInteresseControls(),
    gestoremail: new FormControl(''),
  });

  formDatas = this._fb.group({
    recorrente: new FormControl(false),
    XemXtempo1: new FormControl(''),
    XemXtempo2: new FormControl(''),
    atividadesArr: new FormArray([]), //já vejo
    diaAtividade: new FormControl(new Date(), [Validators.required]),
    dataTermino: new FormControl('', [Validators.required]),
    dataFechoInscricoes: new FormControl('', [Validators.required]),
    dataComeco: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this._userService.getVoluntariosExternos().subscribe(users => {
      this.utilizadoresExternos = users;
      this.emails = this.utilizadoresExternos.map(user => user.email);
      this.filteredEmails = this.formInfo.get('gestoremail').valueChanges
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

  get dataFechoInscricoes() {
    return this.formDatas.get("dataFechoInscricoes");
  }

  get nome() {
    return this.formInfo.get('nome');
  }

  get resumo() {
    return this.formInfo.get('resumo');
  }

  get nrVagas() {
    return this.formInfo.get('nrVagas');
  }

  get diaAtividade() {
    return this.formDatas.get('diaAtividade');
  }

  get atividadesArr() {
    return this.formDatas.get("atividadesArr") as FormArray;
  }

  get dataTermino() {
    return this.formDatas.get("dataTermino");
  }

  get dataComeco() {
    return this.formDatas.get("dataComeco");
  }

  get isFormacaoNecessaria() {
    return this.formInfo.get("necessarioFormacao");
  }

  get formacao() {
    return this.formInfo.get("formacao");
  }

  get gestorEmail() {
    return this.formInfo.get("gestoremail");
  }

  get recorrente() {
    return this.formDatas.get("recorrente");
  }

  get XemXtempo1() {
    return this.formDatas.get("XemXtempo1");
  }

  get XemXtempo2() {
    return this.formDatas.get("XemXtempo2");
  }

  get areasArray() {
    return <FormArray>this.formInfo.get('areas');
  }

  setDataComeco() {
    this.comeco = this.dataComeco.value;
  }

  getDateErrorMessage(control) {
    if (control.hasError('required')) {
      return "Esta data é requirida";
    }
  }

  addAtividade() {
    let dia = _moment(this.diaAtividade.value).toDate();
    console.log(dia)
    this.atividadesArr.push(this._fb.group({
      descricao: new FormControl('', Validators.required),
      //dataAcontecimento: new FormControl(''),
      dia: new Date(dia.getFullYear(), dia.getMonth() + 1, dia.getDate(),),
      horas: new FormControl('', Validators.required),
    })
    );
  }

  removerAtividade(index): void {
    (<FormArray>this.atividadesArr).removeAt(index);
  }

  calculateDaysBetween() {
    this.termino = this.dataTermino.value;
    if (this.dataComeco.value !== '' && this.dataTermino.value !== '') {
      this.diaAtividade.setValue(this.comeco);
      this._datesSet = true;
      this.daysBetween = [];
      let inicio = _moment(this.dataComeco.value);
      let termino = _moment(this.dataTermino.value);
      let diference = termino.diff(inicio, 'days');
      if (diference > 0) {
        for (let i = 0; i < diference; i++) {
          if (i === 0)
            this.daysBetween.push(inicio.toDate());
          let newMoment = inicio.add(1, 'days').toDate();
          this.daysBetween.push(newMoment);
        }
      } else {
        this.daysBetween.push(inicio.toDate());
      }
    }
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

  removerGestor(index) {
    this.emailsAdicionados.splice(index, 1);
    this.gestores.splice(index, 1);
  }

  gestoresEscolhidos() {
    if (!this.emailsAdicionados.includes(this.gestorEmail.value)) {
      let user = this.utilizadoresExternos.find(user => user.email == this.gestorEmail.value)
      this.gestores.push(user);
      this.emailsAdicionados.push(this.gestorEmail.value);
      this.gestorEmail.setValue('');
    } else {
      this._alertService.error("Esse gestor já foi adicionado");
    }
  }

  onFileChanged(files: FileList) {
    this.file = files.item(0);
  }

  addAreasInteresseControls() {
    const arr = this.areas.map(element => {
      return this._fb.control(false);
    });
    return this._fb.array(arr);
  }

  postData() {
    if (this.formInfo.valid && this.formDatas.valid && this.dataTermino.valid && this.dataComeco.valid && this.dataFechoInscricoes.valid) {
      this._userService.getCurrentUserId().subscribe((res) => {
        console.log(res["UserID"]);
        let responsavelId = res["UserID"];
        let XemXtempo = this.XemXtempo1.value + " em " + this.XemXtempo2.value;
        let atividades = [];
        let gestoresIds = []//this.gestores.map((gestor) => { gestorId: gestor._id });
        let selectedAreas = this.selectedAreas;
        for (let gestor in this.gestores) {
          let id = this.gestores[gestor]._id;
          gestoresIds.push({ gestorId: id });
        }
        this.atividadesArr.controls.forEach(atividade => {
          let atividadeObj = atividade.value;
          let horas = parseInt(atividadeObj.horas.split(':')[0]);
          let minutos = parseInt(atividadeObj.horas.split(':')[1]);
          let data = new Date(atividadeObj.dia.getFullYear(), atividadeObj.dia.getMonth(), atividadeObj.dia.getDate(), horas, minutos);
          atividades.push({ descricao: atividadeObj.descricao, dataAcontecimento: data });
        });
        let formBody = { ...this.formInfo.value, ...this.formDatas.value, XemXtempo, atividades, responsavelId, gestoresIds, selectedAreas }
        console.log(formBody);
        this._projectService.addProject(formBody).subscribe((res: ProjetoResponse) => {
          if (this.file) {
            this.imgUpload(res.projetoId);
          }
        });
      });

    } else if (!this.atividadesArr.valid) {
      this._alertService.error("Os campos das atividades são obrigatorios");
    }
    else {
      this._alertService.error("Algum campo obrigatorio não foi preenchido, porfavor preencha todos os campos obrigatorios");
    }
  }

  imgUpload(id) {
    const formData = new FormData();
    formData.append('projetoId', id);
    formData.append('file', this.file, this.file.name);

    const reader = new FileReader();
    const userservice = this._projectService;
    const alert = this._alertService;
    reader.onloadend = () => {
      const src = reader.result;
      userservice.uploadPhoto(formData).subscribe((res) => {
        alert.success("Sucesso");
      }, (err) => {
        alert.error(err.error.msg);
      });
    };
    reader.readAsDataURL(this.file);

  }
}
