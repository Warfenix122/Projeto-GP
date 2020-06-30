var assert = require('assert');
const Foto = require('../models/mongoConnection').Foto;
const Projeto = require('../models/mongoConnection').Projeto;
const User = require('../models/mongoConnection').Utilizadores;
const fs = require('fs');
const path = require('path');

mongoose = require('mongoose');
const db = require("../config/keys").MongoURIProduction;

mongoose.connection.on('error', function (err) {
  console.log(err);
});

var newFoto;
var newProject;
var newUser;

var projectNewFoto = new Projeto ({
    nome:"Projeto teste",
    resumo: "resumo do projeto",
    responsavelId: mongoose.Types.ObjectId(),
    formacoesNecessarias: "formacao teste",
    XemXTempo: "1x a semana",
    gestores: [mongoose.Types.ObjectId()],
    atividades: [],
    vagas: 30,
    projetoMes: false,
    dataCriacao: Date.now(),
    dataTermino: Date.now(),
    dataFechoInscricoes: Date.now(),
    dataComeco: Date.now(),
    areasInteresse: [],
    voluntarios: [],
    fotoCapaId: mongoose.Types.ObjectId()
})
projectNewFoto.save();

var userNewFoto = new User ({
    nome: "USER FOTO NOVA",
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
    fotoPerfilId: mongoose.Types.ObjectId()
});
userNewFoto.save();


describe('Fotos', function(){
    before(function (done) {
        mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
          if(err)
            done(err);
          else
            done();
        });
        
    });

    beforeEach((done) => {
        newFoto = new Foto({
            foto: { data: "file", contentType: "image/png" },
            type:"projects"
        })
        newFoto.save().then((foto) => {
            newUser = new User ({
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
                fotoPerfilId: foto._id
            });
            newUser.save().then((user) => {
                newProject = new Projeto({
                    nome:"Projeto teste",
                    resumo: "resumo do projeto",
                    responsavelId: mongoose.Types.ObjectId(),
                    formacoesNecessarias: "formacao teste",
                    XemXTempo: "1x a semana",
                    gestores: [mongoose.Types.ObjectId()],
                    atividades: [],
                    vagas: 30,
                    projetoMes: false,
                    dataCriacao: Date.now(),
                    dataTermino: Date.now(),
                    dataFechoInscricoes: Date.now(),
                    dataComeco: Date.now(),
                    areasInteresse: [],
                    voluntarios: [],
                    fotoCapaId: foto._id
                });
                newProject.save().then((project) => {
                    done();
                })
            })
        })

    })

    describe('Upload foto', function(){
        it('Foto carregada com sucesso', (done) => {
            const foto1 = new Foto({
                foto: { data: "file", contentType: "image/png" },
                type:"projects"
            })
            foto1.save().then((uploadedFoto) => {
                assert.strictEqual(!uploadedFoto.isNew, true);
                done();
            })
        })
    })

    describe('Apagar foto', function(){
        it('Foto apagada com sucesso', (done) => {
            Foto.deleteOne({ '_id': newFoto._id }).then((foto) => {
                assert.strictEqual((foto._id == null), true)
                done();
            })
        })
    })

    describe ('Alterar foto de perfil', function(){
        it('Foto de perfil alterada com sucesso', (done) => {
            User.findOne({ _id: userNewFoto._id }).then((user) => {
                user.fotoPerfilId = userNewFoto._id;
                user.save().then((updatedUser) => {
                    assert.strictEqual((updatedUser.fotoPerfilId == userNewFoto._id), true);
                    done();
                })
            })
        })
    })

    describe ('Alterar foto de projeto', function(){
        it('Foto de projeto alterada com sucesso', (done) => {
            Projeto.findOne({ _id: projectNewFoto._id }).then((project) => {
                project.fotoCapaId = projectNewFoto.fotoCapaId;
                project.save().then((updatedProject) => {
                    assert.strictEqual((updatedProject.fotoCapaId == projectNewFoto.fotoCapaId), true);
                    done();
                })
            })
        })
    })

})