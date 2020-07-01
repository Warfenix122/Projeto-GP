export class Inscricao {
  utilizadorId: string;
  projetoId: string;
  presente: Boolean;
  avaliacao: [{ valor: Number, descricao: String }];
  cancelado: Boolean;
}
