const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EntidadeSchema = new Schema({
  entidadeId: mongoose.ObjectId,
  predefinido: Boolean,
  nome: String,
});

var CategoriaProjetoSchema = new Schema({
  categoriaId: mongoose.ObjectId,
  predefinido: Boolean,
  nome: String,
});

var PublicoAlvoSchema = new Schema({
  publicoAlvoId: mongoose.ObjectId,
  descricao: String,
  predefinido: Boolean,
});

var UtilizadorSchema = new Schema({
  utilizadorId: mongoose.ObjectId,
  email: String,
  password: String,
  nome: String,
  genero: {
    type: String,
    enum: ["Masculino", "Feminino", "Outro"],
  },
  dataDeNascimento: Date,
  tipoMembro: {
    type: String,
    enum: ["Gestor", "Voluntario Interno", "Voluntario Externo"],
  },
  aprovado: { type: String, enum: ["Recusado", "Em Espera", "Aprovado"] },
  contaConfirmada: Boolean,
  entidades: [{ entidadeId: mongoose.ObjectId }],
  dataCriacao: Date,
  fotoPerfilCaminho: String,
  projetosFavoritos: [mongoose.ObjectId],
  areasInteresse: [{ type: String }],
  numeroTelefone: Number,
  distrito: String,
  concelho: String,
  escola: String,
  formacao: String,

});
var FotoSchema = new Schema({
  foto: { data: Buffer, contentType: String },
  userId: [mongoose.ObjectId]
})

var ProjetoSchema = new Schema({
  projetoId: mongoose.ObjectId,
  nome: String,
  resumo: String,
  responsavelId: mongoose.ObjectId,
  categorias: [{ categoriaId: mongoose.ObjectId }],
  palavrasChave: [{ nome: String }],
  contactos: [{ contacto: String, descricao: String }],
  publicoAlvoId: mongoose.ObjectId,
  formacoesNecessarias: [{ nome: String }],
  logotipoCaminho: String,
  XemXTempo: String,
  edicoes: [
    {
      aprovado: Boolean,
      gestores: [{ gestorId: mongoose.ObjectId }],
      comentarios: [
        {
          comentario: String,
          utilizadorId: mongoose.ObjectId,
          dataCriacao: Date,
        },
      ],
      fotosCaminho: [{ caminho: String }],
      vagas: Number,
      horarios: [{ descricao: String, dataAcontecimento: Date }],
      capaCaminho: String,
      ficheirosCaminho: [{ caminho: String }],
      projetoMes: Boolean,
      dataCriacao: Date,
      dataTermino: Date,
      dataFechoInscricoes: Date,
      dataComeco: Date,
    },
  ],
});

var InscricaoSchema = new Schema({
  inscricaoId: mongoose.ObjectId,
  utilizadorId: mongoose.ObjectId,
  projetoId: mongoose.ObjectId,
  presente: Boolean,
  avaliacao: [{ valor: Number, descricao: String }],
  cancelado: Boolean,
});

const Utilizadores = mongoose.model("Utilizador", UtilizadorSchema, "Utilizador");
const Entidade = mongoose.model("Entidade", EntidadeSchema, "Entidade");
const Inscricao = mongoose.model("Inscricao", InscricaoSchema, "Inscricao");
const CategoriaProjeto = mongoose.model("CategoriaProjeto", CategoriaProjetoSchema, "CategoriaProjeto");
const PublicoAlvo = mongoose.model("PublicoAlvo", PublicoAlvoSchema, "PublicoAlvo");
const Projeto = mongoose.model("Projeto", ProjetoSchema, "Projeto");
const Foto = mongoose.model('Foto', FotoSchema, 'Foto');

module.exports = {
  Utilizadores: Utilizadores,
  Entidade: Entidade,
  Inscricao: Inscricao,
  CategoriaProjeto: CategoriaProjeto,
  PublicoAlvo: PublicoAlvo,
  Projeto: Projeto,
  Foto: Foto
};
