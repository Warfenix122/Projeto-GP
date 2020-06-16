import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { SondagemService } from '../services/sondagem.service';
import { Sondagem } from 'models/sondagem';

@Component({
  selector: 'app-sondagem',
  templateUrl: './sondagem.component.html',
  styleUrls: ['./sondagem.component.css']
})
export class SondagemComponent implements OnInit {
  sondagens: Array<Sondagem>;
  valor : Boolean;
  selectedIndex: number = 0; // index da sondagem selecionada
  selectedAnswerIndex: Array<number>; // indexes das opções que o user selecionou
  selectedOptions: Array<number>; // string das opções selecionadas pelo user
  sondagemId: string;

  constructor(public _fb: FormBuilder, private userService: UserService, private sondagemService: SondagemService) { }



  ngOnInit(): void {
    this.sondagemService.getSondagens().subscribe((sondagens) => {
      console.log(sondagens);
      this.sondagens = sondagens;
    })
  }

  selectIndex(index){
    this.selectedIndex = index;
  }
  getAswerSelectedIndex(index){
    this.selectedAnswerIndex = index;
  }

  onCheck(){
    this.valor = !this.valor;
  }

  onSubmit(otherReason){
    this.selectedAnswerIndex.forEach((opcaoIndex) => {
      this.sondagens.forEach((sondagem) => {
        this.selectedOptions.push(sondagem.opcoes[opcaoIndex].id);
      });
    });
    this.sondagemId = (this.sondagens[this.selectedIndex]._id);
    this.sondagemService.answerSondagem( this.sondagemId, this.selectedOptions, otherReason);
  }
}
