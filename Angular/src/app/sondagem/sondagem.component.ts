import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { SondagemService } from '../services/sondagem.service';
import { Sondagem } from 'models/sondagem';
import { User } from 'models/utilizadores';

@Component({
  selector: 'app-sondagem',
  templateUrl: './sondagem.component.html',
  styleUrls: ['./sondagem.component.css']
})
export class SondagemComponent implements OnInit {
  sondagens: Array<Sondagem> = undefined;
  opcoes: Array<any>;
  chosenSondagem: Sondagem;
  selectedOptions: Array<String>;
  selectedOptionError: Boolean;
  user: User;
  constructor(public _fb: FormBuilder, private userService: UserService, private sondagemService: SondagemService) { }
  formSondagem = this._fb.group({
    opcoes: this.addOpcoes(),
    outro: new FormControl('')
  });




  ngOnInit(): void {

    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      this.user = res['user']
      this.sondagemService.getUnanseredSondagens(this.user._id).subscribe((sondagens) => {
        if (sondagens) this.sondagens = sondagens;
        });
    });
  }

  getSondagem(id) {
    this.chosenSondagem = this.sondagens.find((e) => { if (e._id == id) return e });
    this.formSondagem = this._fb.group({
      opcoes: this.addOpcoes(),
      outro: new FormControl('')
    });


  }

  get outro() {
    return <FormArray>this.formSondagem.get('outro');

  }

  get opcoesArray() {
    return <FormArray>this.formSondagem.get('opcoes');
  }

  getSelectedOptions() {
    this.selectedOptions = [];
    this.opcoesArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedOptions.push(this.chosenSondagem.opcoes[i]);
      }
    });
    this.selectedOptionError = this.selectedOptions.length > 0 ? false : true;

  }
  addOpcoes() {
    if (this.chosenSondagem) {
      const arr = this.chosenSondagem.opcoes.map(element => {
        return this._fb.control(false);
      });
      return this._fb.array(arr);
    }
  }



  onSubmit() {
    if (this.formSondagem.valid) {
      const selected = this.selectedOptions;
      const formbody = { ...this.formSondagem.value, 'options': selected, 'userId': this.user._id, 'sondagemId': this.chosenSondagem._id };
      this.sondagemService.answerSondagem(formbody).subscribe(res => { })
    }
  }
}
