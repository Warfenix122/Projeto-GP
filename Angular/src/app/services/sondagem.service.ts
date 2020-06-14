import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sondagem } from '../../../models/sondagem'

@Injectable({
  providedIn: 'root'
})

export class SondagemService {

  constructor(private http: HttpClient) {
    
  }

  getSondagens(){
    return this.http.get<Sondagem[]>('/api/sondagem');
  }

  getSondagemById(id){
    return this.http.get<Sondagem>('/api/sondagem/' + id);
  }

  answerSondagem(sondagemId, opcoesEscolhidas, outraResposta){
    //Pedir ajuda à paquete para saber como ir buscar o user Id do utilizador logado
    let obj = {
      //utilizadorId: ...,
      //sondagemId: ...,
      //opcoesEscolhidas: ...,
      //outraResposta: ...
    }
    return this.http.post('/api/sondagem', obj);
  }

}
