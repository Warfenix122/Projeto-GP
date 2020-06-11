import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { QuestionarioService } from '../services/questionario.service';
import { Questionario } from 'models/questionario';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.component.html',
  styleUrls: ['./questionario.component.css']
})
export class QuestionarioComponent implements OnInit {
  questionarios: Array<Questionario>;

  constructor(public _fb: FormBuilder, private userService: UserService, private questionarioService: QuestionarioService) { }



  ngOnInit(): void {
    this.questionarioService.getQuestionarios().subscribe((questionarios) => {
      this.questionarios = questionarios;
    })
  }

  getQuestionario(index){
    console.log(this.questionarios[index]);
  }
}
