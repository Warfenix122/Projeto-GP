import { Component, OnInit, Input, Inject } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Atividade } from 'models/atividade';
import { FormControl, FormBuilder } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import {MatDialog, MAT_DIALOG_DATA,  MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-atividades-projeto',
  templateUrl: './atividades-projeto.component.html',
  styleUrls: ['./atividades-projeto.component.css']
})
export class AtividadesProjetoComponent implements OnInit {
  @Input() projectId : number;
  @Input() isEditButtonClicked : boolean;
  @Input() dataInicio: Date;
  @Input() dataTermino: Date;
  atividades: Atividade[];
  horas: Date[];

  constructor(private _projectService: ProjectService,private _alertService:AlertService, public dialog: MatDialog) { }

  removerAtividade(atividadeId,index){
    this._projectService.removerAtividades(this.projectId,atividadeId).subscribe(res=>{
      console.log(res);
      if(res["success"]===true){
        this.atividades.splice(index,1);
        this._alertService.success(res["msg"]);
      }else{
        this._alertService.error(res["msg"]);
      }
    });
    
  }

  ngOnInit(): void {
    this._projectService.getAtividades(this.projectId).subscribe(res=>{
      this.atividades = res["atividades"];
      for(let atividade of this.atividades){
        atividade.dataAcontecimento = new Date(atividade.dataAcontecimento);
      }
    });
  }

  openAddAtividadeDialog() {
    let dialogRef = this.dialog.open(DialogAddAtividade, {
      width: '700px',
      data:{dataInicio: this.dataInicio, dataTermino: this.dataTermino}
    });
    dialogRef.afterClosed().subscribe((atividade) => {
      if(atividade!==undefined){
        this._projectService.addAtividade(this.projectId,atividade).subscribe(res=>{
          if(res["success"]===true){
            this._alertService.success(res["msg"]);
            this.atividades.push(atividade)
          }else
            this._alertService.error(res["msg"]);
        });
      }
    });
  }

  openEditManagerDialog(index,atividade){
    let dialogRef = this.dialog.open(DialogEditAtividade, {
      width: '700px',
      data:{dataInicio: this.dataInicio, dataTermino: this.dataTermino, atividade: atividade}
    });
    dialogRef.afterClosed().subscribe((atividade) => {
      if(atividade!== undefined){
        this._projectService.editAtividade(this.projectId,atividade).subscribe(res=>{
          if(res["success"]===true){
            this._alertService.success(res["msg"]);
            this.atividades.splice(index,1,atividade);
          }else
            this._alertService.error(res["msg"]);
        })
      }
    });
  }
}



@Component({
  selector: 'dialog-add-atividade',
  templateUrl: 'dialog-add-atividade.html',
})
export class DialogAddAtividade {

  dataInicio: Date
  dataTermino: Date

  constructor(private _fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<DialogAddAtividade>){
    this.dataInicio = new Date(data.dataInicio);
    this.dataTermino = new Date(data.dataTermino);
  }

  formAdd=this._fb.group({
    addDescricao: new FormControl(''),
    addHoras: new FormControl(),
    addData: new FormControl(),
  })

  get addDescricao(){
    return this.formAdd.get("addDescricao");
  }

  get addHoras(){
    return this.formAdd.get("addHoras");
  }

  get addData(){
    return this.formAdd.get("addData");
  }

  onClose(isAdded){
    if(isAdded){
      let dataDia = new Date(this.addData.value);
      let horas = this.addHoras.value.split(":");
      dataDia.setHours(horas[0]);
      dataDia.setMinutes(horas[1]);
      
      let atividade = {descricao:this.addDescricao.value,dataAcontecimento:dataDia};
      console.log(atividade);
      this.dialogRef.close(atividade);
    }
  }
}


@Component({
  selector: 'dialog-edit-atividade',
  templateUrl: 'dialog-edit-atividade.html',
})
export class DialogEditAtividade {

  dataInicio : Date;
  dataTermino: Date;
  atividadeId: string;
  descricao: string;
  dataAcontecimento: Date;
  horas: string;

  formEdit=this._fb.group({
    editDescricao: new FormControl(this.descricao),
    editData: new FormControl(this.dataAcontecimento),
    editHoras: new FormControl(this.horas),
  });

  constructor(private _fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<DialogAddAtividade>){
    this.dataInicio = new Date(data.dataInicio);
    this.dataTermino = new Date(data.dataTermino);
    this.atividadeId = data.atividade._id;
    this.descricao = data.atividade.descricao;
    this.dataAcontecimento = new Date(data.atividade.dataAcontecimento);
    this.horas = this.dataAcontecimento.getHours()+":"+this.dataAcontecimento.getMinutes();
    this.editDescricao.setValue(this.descricao)
    this.editData.setValue(this.dataAcontecimento);
    this.editHoras.setValue(this.horas);
  }

  

  get editDescricao(){
    return this.formEdit.get("editDescricao");
  }

  get editHoras(){
    return this.formEdit.get("editHoras");
  }

  get editData(){
    return this.formEdit.get("editData");
  }

  onClose(isAdded){
    if(isAdded){
      let dataDia = new Date(this.editData.value);
      let horas = this.editHoras.value.split(":");
      dataDia.setHours(horas[0]);
      dataDia.setMinutes(horas[1]);
      
      let atividade = {_id:this.atividadeId,descricao:this.editDescricao.value,dataAcontecimento:dataDia};

      this.dialogRef.close(atividade);
    }
  }

}