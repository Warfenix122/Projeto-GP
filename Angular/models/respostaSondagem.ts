export class RespostaSondagem{
    _id: string;
    utilizadorId: string;
    sondagemId: string;
    opcoesEscolhidas: [{
  	    opcaoId: number,
  	    escolheu: boolean, //escolheu ou nao
    }];
    outraResposta: string
}