export class User {
  _id: string;
  public nome: string;
  public email: string;
  private password: string;
  public numeroTelefone: number;
  public dataNascimento: Date;
  public tipoMembro: string;
  aprovado: Boolean;
  entidades: [number];
  dataCriacao: Date;
  fotoPerfilCaminho: String;
  projetosFavoritos: [string];
  areasInteresse: [{ type: string }];
  distrito: String;
  concelho: String;
  escola: String;
  formacao: String;
  fotoPerfilId:string;
}
