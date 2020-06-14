export class User {
  _id: String;
  public nome: string;
  public email: string;
  private password: string;
  public numeroTelefone: number;
  public dataDeNascimento: Date;
  public tipoMembro: String;
  aprovado: Boolean;
  entidades: [number];
  dataCriacao: Date;
  fotoPerfilCaminho: String;
  projetosFavoritos: [number];
  areasInteresse: [{ type: string }];
  distrito: String;
  concelho: String;
  escola: String;
  formacao: String;
}
