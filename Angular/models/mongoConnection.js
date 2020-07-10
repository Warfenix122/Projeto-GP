const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UtilizadorSchema = new Schema({
    email: String,
    password: String,
    nome: String,
    genero: {
        type: String,
        enum: ["Masculino", "Feminino", "Outro"],
    },
    dataNascimento: Date,
    tipoMembro: {
        type: String,
        enum: ["Gestor", "Voluntario Interno", "Voluntario Externo"],
    },
    aprovado: { type: String, enum: ["Recusado", "Em Espera", "Aprovado"] },
    contaConfirmada: Boolean,
    entidades: [{ entidadeId: mongoose.ObjectId }],
    dataCriacao: Date,
    projetosFavoritos: [mongoose.ObjectId],
    areasInteresse: [{ type: String }],
    numeroTelefone: Number,
    distrito: String,
    concelho: String,
    escola: String,
    formacao: String,
    fotoPerfilId: mongoose.ObjectId


});

var FotoSchema = new Schema({
    foto: { data: Buffer, contentType: String },
    type: {
        type: String,
        enum: ["projects", "users", "carousel"]
    }
})

var ProjetoSchema = new Schema({
    nome: String,
    resumo: String,
    responsavelId: mongoose.ObjectId,
    palavrasChave: [{ nome: String }],
    contactos: [{ contacto: String, descricao: String }],
    publicoAlvoId: mongoose.ObjectId,
    formacoesNecessarias: [String],
    XemXTempo: String, // "1 vez por mes " etc..
    aprovado: { type: String, enum: ["Recusado", "Em Espera", "Aprovado"] },
    gestores: [mongoose.ObjectId], //só podem ser externos
    comentarios: [{ comentario: String, utilizadorId: mongoose.ObjectId, dataCriacao: Date, }, ],
    vagas: Number,
    atividades: [{ descricao: String, dataAcontecimento: Date }],
    ficheirosCaminho: [{ caminho: String }],
    projetoMes: { state: Boolean, position: Number },
    dataCriacao: Date,
    dataTermino: Date,
    dataFechoInscricoes: Date,
    dataComeco: Date,
    areasInteresse: [String], //Areas onde este projeto se enquadra
    voluntarios: [{ userId: mongoose.ObjectId, estado: { type: String, enum: ["Recusado", "Em Espera", "Aprovado"] } }],
    fotoCapaId: mongoose.ObjectId,
    restringido: Boolean,
});

var SondagemSchema = new Schema({
    sondagemId: mongoose.ObjectId,
    titulo: String,
    descricao: String,
    opcoes: [String]
});

var RespostaSchema = new Schema({
    userId: mongoose.ObjectId,
    sondagemId: mongoose.ObjectId,
    opcoes: [String],
    outraResposta: String
})

var FaqSchema = new Schema({
    pergunta: String,
    resposta: String
})

const Utilizadores = mongoose.model("Utilizador", UtilizadorSchema, "Utilizador");
const Projeto = mongoose.model("Projeto", ProjetoSchema, "Projeto");
const Foto = mongoose.model('Foto', FotoSchema, 'Foto');
const Sondagem = mongoose.model("Sondagem", SondagemSchema, "Sondagem");
const Resposta = mongoose.model("Resposta", RespostaSchema, "Resposta");
const Faq = mongoose.model("Faq", FaqSchema, "Faq");

module.exports = {
    Utilizadores: Utilizadores,
    Projeto: Projeto,
    Foto: Foto,
    Sondagem: Sondagem,
    Resposta: Resposta,
    Faq : Faq
};
