import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { SondagemService } from '../services/sondagem.service';
import { Sondagem } from 'models/sondagem';
import { User } from 'models/utilizadores';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../services/alert.service';
import { RespostaSondagem } from 'models/respostaSondagem';

@Component({
  selector: 'app-sondagem',
  templateUrl: './sondagem.component.html',
  styleUrls: ['./sondagem.component.css']
})
export class SondagemComponent implements OnInit {
  polls: Array<Sondagem> = undefined;
  user: User;
  constructor(public _fb: FormBuilder, private userService: UserService, private sondagemService: SondagemService, public dialog: MatDialog, private alertService: AlertService) { }

  ngOnInit(): void {

    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      this.user = res['user']
      this.sondagemService.getUnanseredSondagens(this.user._id).subscribe((polls) => {
        if (polls) this.polls = polls;
        });
    });
  }

  openPollDialog(id){
    let chosenPoll = this.polls.find((e) => { if (e._id == id) return e });
    const dialogRef = this.dialog.open(DialogShowPoll, {
      width: '400px',
      data: { chosenPoll: chosenPoll, user: this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.sondagemService.answerSondagem(result).subscribe((res) => {
          let index = this.polls.findIndex(elem => elem._id == res["answer"].sondagemId);
          this.polls.splice(index, 1);
          this.alertService.success("Resposta guardada com sucesso");
        }, err => this.alertService.error(err["error"].msg));
      }
    })
  }
}


@Component({
  selector: 'dialog-show-poll',
  templateUrl: 'dialog-show-poll.html',
})
export class DialogShowPoll implements OnInit{
  pollForm: FormGroup;
  opcoes: Array<any>;
  selectedOptions: Array<String>;
  selectedOptionError: Boolean;
  chosenPoll: Sondagem;
  user: User;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogShowPoll>, public _fb: FormBuilder, private sondagemService: SondagemService,private _alertService:AlertService) {
    this.chosenPoll = data.chosenPoll;
    this.user = data.user;
  }

  ngOnInit(){
    this.pollForm = this._fb.group({
      opcoes: this.addOpcoes(),
      outro: new FormControl('')
    });
  }

  get outro() {
    return <FormArray>this.pollForm.get('outro');

  }

  get opcoesArray() {
    return <FormArray>this.pollForm.get('opcoes');
  }

  addOpcoes() {
    if (this.chosenPoll) {
      const arr = this.chosenPoll.opcoes.map(element => {
        return this._fb.control(false);
      });
      return this._fb.array(arr);
    }
  }

  onSubmit() {
    if (this.pollForm.valid) {
      const selected = this.selectedOptions;
      const formbody = { ...this.pollForm.value, 'options': selected, 'userId': this.user._id, 'sondagemId': this.chosenPoll._id };
      this.dialogRef.close(formbody);
    }
  }

  getSelectedOptions() {
    this.selectedOptions = [];
    this.opcoesArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedOptions.push(this.chosenPoll.opcoes[i]);
      }
    });
    this.selectedOptionError = this.selectedOptions.length > 0 ? false : true;
  }
}
