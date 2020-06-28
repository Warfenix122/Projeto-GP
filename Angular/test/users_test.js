const User = require('../models/mongoConnection').Utilizadores;

mongoose = require('mongoose');
const db = require("../config/keys").MongoURITest;

mongoose.connection.on('error', function (err) {
  console.log(err);
});

var assert = require('assert');
var bcrypt = require('bcrypt');

var newUser;
describe('Users', function() {
  before(function (done) {
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
      if(err)
        done(err);
      else
        done();
    });
    
  })
  beforeEach((done) => {
    newUser = new User({
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
      aprovado: "Aprovado"
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        //set Password to hashed
        newUser.password = hash;
        //save user
        newUser
          .save().then((user) => {
            done();
          })
          .catch((err) => done(err));
        });
      });
  })
  describe('#criarUtilizador()', function() {
    it('utilizador é criado sem erros', function(done) {
      const newUser1 = new User({
        nome: "Nome teste",
        email: "abc123@gmail.com",
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
        aprovado: "Aprovado"
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser1.password, salt, (err, hash) => {
          if (err) throw err;
          //set Password to hashed
          newUser1.password = hash;
          //save user
          newUser1
            .save().then((user) => {
              assert.strictEqual(!user.isNew, true);
              done();
            })
            .catch((err) => done(err));
          });
        });
    });
  });
  describe('#lerUtilizador()', () => {
    it('procurar utilizador com email não existente', (done) => {
      User.findOne({ email: "emaildostestesabcdefghijklmnopqrstuv@gmail.com" })
      .then(() => {
        done();        
      })
      .catch((err) => {
        done(err);
      });
    });
    it('procurar utilizador através do email', (done) => {
      User.findOne({ email: "emailTest@hotmail.com" })
      .then((user) => {
        let exists = false;
        if(user)
          exists = true;
        else
          exists = false;
        assert.strictEqual(exists, true);
        done();        
      })
      .catch((err) => {
        done(err);
      });
    });
  });
  describe("#atualizarUtilizador()", () => {
    it('atualizar utilizador', (done) => {
      User.findOne({ email: "emailTest@hotmail.com" })
      .then((user) => {
        user.nome = "Nome diferente";
        user.save().then((updatedUser) => {
          let diff = false;
          if(updatedUser.nome != newUser.nome)
            diff = true;
          else
            diff = false;
          assert.strictEqual(diff, true);
          done();
        })
        .catch((err) => done(err));
      })
      .catch((err) => {
        done(err);
      });
    });
  });
  describe("#usersEmEspeera()", () => {
    it('procurar utilizadores com o estado "em espera"', (done) => {
      User.find({aprovado:"Em Espera"}).then((users)=>{
        if(users)
          assert.strictEqual(true, true);
        else
          assert.strictEqual(false, true);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe("#avaliarUsers()", () => {
    it('passar o estado de um utilizador para "aprovado"', (done) => {
      const email = "emailTest@hotmail.com";
      const aprovado = "Aprovado";
      user = User.updateOne({email:email}, {aprovado:aprovado},function(err,doc) {
        if(err) done(err);
        done();
      });
    })
  });
});