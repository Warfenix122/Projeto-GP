export class Questionario {
  _id: string;
  nome: string;
  descricao: string;
  perguntas: [{
  	id: number,
  	pergunta: string
  }];
}
