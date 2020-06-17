import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sondagem } from '../../../models/sondagem';
import { User } from 'models/utilizadores';
import { UserService } from './user.service';
import { RespostaSondagem } from 'models/respostaSondagem';

@Injectable({
  providedIn: 'root'
})

export class SondagemService {

  constructor(private http: HttpClient, private userService: UserService) {

  }

  createSondagem(formdata) {
    return this.http.post('/api/sondagem', formdata);
  }

  getSondagens() {
    return this.http.get<Sondagem[]>('/api/sondagem');
  }

  getAnsweredSondagens(userId) {
    return this.http.get<Sondagem[]>('/api/sondagem/answered/' + userId);
  }

  getUnanseredSondagens(userId) {
    return this.http.get<Sondagem[]>('/api/sondagem/unanswered/' + userId);
  }


  getSondagemById(id) {
    return this.http.get<Sondagem>('/api/sondagem/' + id);
  }

  answerSondagem(formbody) {
    return this.http.post('/api/sondagem/answer', formbody, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });

  }

}
