const { assert } = require('console');

const Projeto = require('../Angular/models/mongoConnection').Projeto;
const User = require('../Angular/models/mongoConnection').Utilizadores;


mongoose = require('mongoose');
const db = require("../Angular/config/keys").MongoURIProduction;

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
            responsavelId: mongoose.ObjectId,
            formacoesNecessarias: "formacao teste",
            XemXTempo: "1x a semana",
            gestores: mongoose.ObjectId,
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
            projetosFavoritos: projetosFavoritos.push(newProject._id)
        });

    });

    describe('Criar projeto', function(){
        it('Projeto criado com sucesso', function(done){
            const newProject1 = new Projeto({
                nome:"Projeto teste",
                resumo: "resumo do projeto",
                responsavelId: mongoose.ObjectId,
                formacoesNecessarias: "formacao teste",
                XemXTempo: "1x a semana",
                gestores: mongoose.ObjectId,
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
        })
        newProject.save().then((project) => {
            assert.strictEqual(!project.isNew, true);
            done();
        });
    });

    describe('Editar projeto', function(){
        it('Atualizar projeto', (done) => {
            Projecto.findOne({ _id: newProject._id }).then((project) => {
                project.nome = "projeto";
                project.save().then((updatedProject) => {
                    let isChanged = false;
                    if(updatedProject.nome != project.nome){
                        isChanged = true;
                    } else {
                        isChanged = false;
                    }
                    assert.strictEqual(isChanged, true);
                    done();
                })
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
            Projecto.find({}).then((projects) => {
               assert.strictEqual(projects.lenght, 1);
               done();
            });
        });
    });

    describe('Favoritos', function(){
        it('Projetos favoritos de um user', (done) => {
            User.find({ _id: user._id }).then((user) => {
                let fav = user["projetosFavoritos"];
                let arr = [newProject._id];
                let areTheSame = false
                if(fav.equals(arr)){
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
            Project.findOne({_id: newProject._id}).then((project)=>{
                if(project["voluntarios"].includes(voluntarioId)){
                    let indexOfId = project["voluntarios"].indexOf(voluntarioId);
                    project["voluntarios"].splice(indexOfId,1);
                    project.save().then((updatedProject) =>{
                        let isRemoved = false;
                        if(!updatedProject["voluntarios"].includes(user._id)){
                            isRemoved = true;
                        } else {
                            isRemoved = false;
                        }
                        assert.strictEqual(isRemoved, true);
                    })
                }
            });
        })
    });

    describe('Candidatar', function() {
        it('Inscrito', (done) => {
            Project.findOne({_id: newProject._id}).then((project)=>{
                let vagas = project.vagas;
                if(project["voluntarios"].length+1 < vagas){
                    project["voluntarios"].push(user._id);
                }
                project.save().then((updatedProject)=>{
                    assert.strictEqual(updatedProject["voluntarios"].includes(user._id), true);
                })
            })
        });
    });
});

