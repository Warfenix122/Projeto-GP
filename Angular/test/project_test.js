var assert = require('assert');

const Projeto = require('../models/mongoConnection').Projeto;
const User = require('../models/mongoConnection').Utilizadores;

var generateString = () => {
    var result = '';
    var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

mongoose = require('mongoose');
const db = require("../config/keys").MongoURIProduction;

mongoose.connection.on('error', function (err) {
  console.log(err);
});

var newProject;

describe('Projetos', function(){
    before(function (done) {
        mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
          if(err)
            done(err);
          else
            done();
        });
        
    });

    beforeEach((done) => {
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
            voluntarios: []
        });
        newProject.save().then((project) => {
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
                projetosFavoritos: [project._id]
            });
            user.save().then((res) => {
                done();
            }).catch((err) => done(err));
        }).catch((err) => done(err));
    });

    describe('Criar projeto', function(){
        it('Projeto criado com sucesso', function(done){
            const newProject1 = new Projeto({
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
                voluntarios: []
            })
            newProject1.save().then((project) => {
                assert.strictEqual(!project.isNew, true);
                done();
            });
        })
    });

    describe('Editar projeto', function(){
        it('Atualizar projeto', (done) => {
            Projeto.findOne({ nome: 'Projeto teste' }).then((project) => {
                project.nome = generateString();
                project.save().then((updatedProject) => {
                    let res = updatedProject.nome != newProject.nome;
                    assert.strictEqual(res, true);
                    done();
                })
            }, (err) => {
                done(err);
            });
        })
        
    });

    describe('Buscar info de um projeto', function(){
        it('Informacao de um projeto', (done) => {
            Projeto.findOne({ _id: newProject._id}).then((project) => {
                let name = project.nome;
                let summary = project.resumo;
                let rightProject = false;
                if(newProject.nome == name && newProject.resumo == summary){
                    rightProject = true;
                } else {
                    rightProject = false;
                }
                assert.strictEqual(rightProject, true);
                done();
            })
        })
    });

    describe('Listar projetos', function(){
        it('Lista com todos os projetos', (done) => {
            Projeto.find({}).then((projects) => {
                let res = projects.length >= 1;
                assert.strictEqual(res, true);
                done();
            });
        });
    });

    describe('Adicionar projeto favorito', function(){
        it('Projeto adicionado aos favoritos', (done) => {
            User.findOne({ _id: user._id}).then((user) => {
                let fav = user["projetosFavoritos"];
                fav.push(newProject._id);
                user.save().then((updatedUser) => {
                    assert.strictEqual(updatedUser["projetosFavoritos"].includes(newProject._id), true);
                    done();
                })
            })
        })
    })

    describe('Remover projeto favorito', function() {
        it('Projeto removido com sucesso', (done) => {
            User.findOne({ _id: user._id}).then((user) => {
                let index = user["projetosFavoritos"].indexOf(newProject._id);
                if (index > -1) {
                    user["projetosFavoritos"].splice(index, 1);
                }
                user.save().then((updatedUser) => {
                    assert.strictEqual(updatedUser["projetosFavoritos"].includes(newProject._id), false);
                    done();
                })
            })
            
        })
    })

    describe('Favoritos', function(){
        it('Projetos favoritos de um user', (done) => {
            User.findOne({ _id: user._id }).then((user) => {
                let fav = user["projetosFavoritos"];
                let areTheSame = false
                if(fav.includes(newProject._id)){
                    areTheSame = true;
                } else {
                    areTheSame = false;
                }
                assert.strictEqual(areTheSame, true);
                done();
            });
        });
    });

    describe('Anular candidatura', function(){
        it('Inscricao no projeto anulada', (done) => {
            newProject.voluntarios.push(user._id);
            newProject.save().then((project) => {
                if(project["voluntarios"].includes(user._id)){
                    let indexOfId = project["voluntarios"].indexOf(user._id);
                    project["voluntarios"].splice(indexOfId,1);
                    project.save().then((updatedProject) =>{
                        let isRemoved = false;
                        if(!updatedProject["voluntarios"].includes(user._id)){
                            isRemoved = true;
                        } else {
                            isRemoved = false;
                        }
                        assert.strictEqual(isRemoved, true);
                        done();
                    })
                }
            });
        })
    });

    describe('Candidatar', function() {
        it('Inscrito', (done) => {
            Projeto.findOne({_id: newProject._id}).then((project)=>{
                let vagas = project.vagas;
                if(project["voluntarios"].length+1 < vagas){
                    project["voluntarios"].push(user._id);
                }
                project.save().then((updatedProject)=>{
                    assert.strictEqual(updatedProject["voluntarios"].includes(user._id), true);
                    done();
                })
            })
        });
    });

});

