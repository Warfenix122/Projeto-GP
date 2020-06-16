import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sondagem } from '../../../models/sondagem';
import { User } from 'models/utilizadores';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

export class SondagemService {

  user: User;

  constructor(private http: HttpClient, private userService: UserService) {
    
  }

  getSondagens(){
    return this.http.get<Sondagem[]>('/api/sondagem');
  }

  getSondagemById(id){
    return this.http.get<Sondagem>('/api/sondagem/' + id);
  }

  answerSondagem(sondagemId, opcoesEscolhidas, outraResposta){
   
    this.userService.profile(localStorage.getItem('token')).subscribe((res) => {
      this.user = res['user'];
      let obj = {
      
        utilizadorId: this.user._id,
        sondagemId: sondagemId,
        opcoesEscolhidas: opcoesEscolhidas,
        outraResposta: outraResposta
      }
      
      return this.http.post('/api/sondagem', obj);
    });
    
    
  }

}
