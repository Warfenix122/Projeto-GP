import { Component, OnInit, Inject } from '@angular/core';
import { Sondagem } from 'models/sondagem';
import { SondagemService } from '../services/sondagem.service';
import { FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { identifierName } from '@angular/compiler';
import { AlertService } from '../services/alert.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogDeleteProject } from '../project/project.component';
import { RespostaSondagem } from 'models/respostaSondagem';
import { User } from 'models/utilizadores';

@Component({
  selector: 'app-create-sondagem',
  templateUrl: './create-sondagem.component.html',
  styleUrls: ['./create-sondagem.component.css']
})
export class CreateSondagemComponent implements OnInit {
  sondagens: Array<Sondagem>;

  constructor(public _fb: FormBuilder, private userService: UserService, private sondagemService: SondagemService, private alertService: AlertService, public dialog: MatDialog) {
    
   }

  formSondagem = this._fb.group({
    titulo: new FormControl('', Validators.required),
    descricao: new FormControl('', Validators.required),
  });



  ngOnInit(): void {
    this.getSondagens()
    // this.authService.getRole().subscribe(res =>{
    //   if(res["Role"] !== "Gestor")
    //     this.router.navigate(['unauthorized']);
    // });
  }

  getSondagens() {
    this.sondagemService.getSondagens().subscribe((res) => {
      this.sondagens = res;
    })
  }

  get titulo() {
    return <FormArray>this.formSondagem.get('titulo');
  }



  get descricao() {
    return <FormArray>this.formSondagem.get('descricao');
  }

  get opcao() {
    return <FormArray>this.formSondagem.get('opcao');

  }
  createOption(numberOptions) {
    let optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    let options = numberOptions.value;
    console.log('options :>> ', options);
    for (let index = 0; index < options; index++) {
      let row = document.createElement('div');
      row.className = "row";
      const label = document.createElement('label');
      label.innerHTML = 'Opção';
      label.className = "col-md-4"
      let input = document.createElement('input');
      input.type = 'text';
      input.id = "opcao" + index;
      input.name = "opcao" + index;
      input.className = "option col-md-4 form-control";

      row.appendChild(label);
      row.appendChild(input);
      optionsDiv.appendChild(row);
    }
  }


  getOptions() {
    let options = document.getElementsByClassName('option');
    let opts = new Array();
    for (const iterator in options) {
      if (options[iterator]['value']) {
        opts.push(options[iterator]['value'])
      }
    }
    return opts
  }

  onSubmit() {
    const options = this.getOptions();

    if (options.length > 0 && this.formSondagem.valid) {
      console.log('options :>> ', options);
      const form = { ...this.formSondagem.value, "opcao": options }
      console.log('form :>> ', form);
      this.sondagemService.createSondagem(form).subscribe(res => {
        if (res) {
          this.getSondagens();
          this.alertService.success("Sondagem criada com sucesso")
        }
      },
        (err) => {
          this.alertService.error("Impossivel criar sondagem")

        });
    } else if (options.length <= 0) {
      this.alertService.error("Por favor insira opções na sondagem")


    } else if (!this.formSondagem.valid) {
      this.alertService.error("Formilario invalido")

    }
  }

  pollClicked(index, event){
    if(event.target.localName == "button" || event.target.parentNode.localName == "button"){} else {
      let poll = this.sondagens[index];
        this.sondagemService.getAnswersFromPoll(poll._id).subscribe(answers => {
          let usersId = answers.map(answer => {
            return answer.userId;
          })
          this.userService.getUsers(usersId).subscribe(users => {
            console.log(users);
            const dialogRef = this.dialog.open(DialogSondagem, {
              width: '1200px',
              data: {poll: poll, answers: answers, users: users}
            });
          })
      })
    }
  }

  clickDeletePoll(index, event){
    let poll = this.sondagens[index];
    const dialogRef = this.dialog.open(DialogRemovePoll, {
      width: '700px',
      data: {poll: poll}
    });

    dialogRef.afterClosed().subscribe(isDelete => {
      if(isDelete)
        this.sondagemService.deleteSondagem(poll._id).subscribe(deletedPoll => {
          let i = this.sondagens.findIndex(polll => polll._id == poll._id);
          this.sondagens.splice(i, 1);
          this.alertService.success("Sondagem eliminada com sucesso");
        })
    })
  }

}

@Component({
  selector: 'dialog-sondagem',
  templateUrl: 'dialog-sondagem.html',
})
export class DialogSondagem {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[];

  poll: Sondagem;
  chosenOptions: Array<number> = [];
  users: Array<User>;
  answers: Array<RespostaSondagem> = [];
  otherAnswers: Array<any> = [];
  totalAnswers: number = 0;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogSondagem>) {
    this.poll = data.poll;
    this.chosenOptions = this.poll.opcoes.map(poll => {return 0});
    this.users = data.users;
    this.answers = data.answers;

    this.barChartLabels = this.poll.opcoes;

    this.totalAnswers = this.answers.length;

    this.answers.forEach(answer => {
      let options = answer.opcoes;
      if(options != undefined)
        options.forEach(option => {
          let i = this.poll.opcoes.findIndex(elem => elem == option);
          this.chosenOptions[i]++;
        })

      let otherAnswer = answer.outraResposta;
      if(otherAnswer != undefined && otherAnswer.length > 0)
        this.otherAnswers.push({
          text: otherAnswer,
          writer: this.users.find(user => user._id == answer.userId).nome
        });
    })
    console.log(this.chosenOptions);
    this.barChartData = [
      { data: this.chosenOptions, label: 'Número de utilizadores que escolheu a opção' }
    ];
  }

}

@Component({
  selector: 'dialog-remove-poll',
  templateUrl: 'dialog-remove-poll.html',
})
export class DialogRemovePoll {
  poll: Sondagem;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogRemovePoll>) {
    this.poll = data.poll;
  }
}