import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Questionario } from '../../../models/questionario'

@Injectable({
  providedIn: 'root'
})

export class QuestionarioService {

  constructor(private http: HttpClient) {
    
  }

  getQuestionarios(){
    return this.http.get<Questionario[]>('/api/questionario');
  }

  getQuestionarioById(id){
    return this.http.get<Questionario>('/api/questionario/' + id);
  }


}
