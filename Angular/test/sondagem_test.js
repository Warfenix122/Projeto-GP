var assert = require('assert');
const User = require('../models/mongoConnection').Utilizadores;
const Sondagem = require('../models/mongoConnection').Sondagem;
const Resposta = require('../models/mongoConnection').Resposta;

mongoose = require('mongoose');
const db = require("../config/keys").MongoURIProduction;

mongoose.connection.on('error', function (err) {
    console.log(err);
});

var newSondagem;
var newResposta;

describe('Sondagens', function(){
    before(function (done) {
        mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
          if(err)
            done(err);
          else
            done();
        });
        
    });

    beforeEach((done) => {
        newSondagem = new Sondagem({
            titulo: "Sondagem teste",
            descricao: "descricao sondagem",
            opcoes: ['opção1', 'opção2', 'opção3']
        });
        newSondagem.save().then((sondagem) => {
            user = new User ({
                nome: "Nome teste",
                email: "emailTest@hotmail.com",
                password: "abcdasdf",
                genero: "Masculino",
                dataDeNascimento: Date.now(),
                dataCriacao: Date.now(),
                areasInteresse: [],
                distrito: "Setubal",
                concelho: "Almada",
                tipoMembro: "Gestor",
                numeroTelefone: 919999999,
                escola: "Uma escola",
                formacao: "Uma formacao",
                aprovado: "Aprovado",
            });
            user.save().then((newUser) => {
                newResposta = new Resposta({
                    userId: newUser.userId,
                    sondagemId: newSondagem._id,
                    opcoes: [],
                    outraResposta: ''
                });
                newResposta.save().then((res) => {
                    done();
                }).catch((err) => done(err));
            }).catch((err) => done(err));
        }).catch((err) => done(err));
    });

    describe('Criar sondagem', function(){
        it('Sondagem criada com sucesso', function(done){
            const newSondagem1 = new Sondagem({
                titulo: "Sondagem teste",
                descricao: "descricao sondagem",
                opcoes: ['opção1', 'opção2', 'opção3']
            });
            newSondagem1.save().then((sondagem) => {
                assert.strictEqual(!sondagem.isNew, true);
                done();
            });
        });

    });

    describe('Buscar uma sondagem', function(){
        it('Sondagem aberta', (done) => {
            Sondagem.findOne({_id: newSondagem._id}).then((sondagem) => {
                let opcoesSondagem = sondagem["opcoes"];
                let contemOpcoes = newSondagem["opcoes"];
                assert.strictEqual((JSON.stringify(opcoesSondagem) == JSON.stringify(contemOpcoes)), true);
                done();
            });
        });
    });

    describe('Listar sondagens', function(){
        it('Lista com todas as sondagens', (done) => {
            Sondagem.find({}).then((sondagens) => {
                let res = sondagens.length >= 1;
                assert.strictEqual(res, true);
                done();
            });
        });
    });

    describe('Resposta', function(){
        it('Responder a uma sondagem', (done) => {
            Sondagem.findOne({_id: newSondagem._id}).then((sondagem) => {
                User.findOne({_id: user._id}).then((user) => {
                    const newRespostaTest = new Resposta({
                        userId: user._id,
                        sondagemId: sondagem._id,
                        opcoes: sondagem["opcoes"],
                        outraResposta: sondagem.outraResposta                    
                    })
                    newRespostaTest.save().then((respostaDone) => {
                        assert.strictEqual(!respostaDone.isNew, true);
                        done();
                    });
                });
            });  
        });
    });
})
