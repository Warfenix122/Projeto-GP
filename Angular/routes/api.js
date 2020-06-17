const express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const utils = require('../utils/utils');
const passport = require('passport');
var jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../models/mongoConnection').Utilizadores;
const Foto = require('../models/mongoConnection').Foto;
router = require("./email");
const sondagemAPI = require('./sondagem');
const projectAPI = require('./project');
const fotoAPI = require('./foto');
const fileAPI = require('./file');

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

router.use("/project", projectAPI);
router.use("/foto", fotoAPI);
router.use("/file", fileAPI);
router.use('/sondagem', sondagemAPI);

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: "You are successfully authenticated to this route!",
    });
  }
);

//Register handle
router.post("/register", (req, res) => {
  const {
    nome,
    email,
    password,
    genero,
    dataNascimento,
    tipoMembro,
    distrito,
    concelho,
    numeroTelefone,
    escola,
    formacao,
    selectedAreas,
  } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.status(409).send("O email introduzido já foi registasdo");
    } else {
      const newUser = new User({
        nome,
        email,
        password,
        genero,
        dataNascimento,
        dataCriacao: Date.now(),
        areasInteresse: selectedAreas,
        distrito,
        concelho,
        tipoMembro,
        numeroTelefone,
        escola,
        formacao,
        aprovado: "Aprovado",
        contaConfirmada: false,
      });
      if (tipoMembro === "Voluntario Externo") {
        newUser.aprovado = "Em Espera";
      }
      //Hash Password
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          //set Password to hashed
          newUser.password = hash;
          //save user
          newUser
            .save()
            .then((user) => {
              const jwt = utils.issueJWT(user);
              res.status(200).json({
                success: true,
                user: newUser,
                token: jwt.token,
                expiresIn: jwt.expires,
              });
            })
            .catch((err) => console.log(err));
        })
      );
    }
  });
  //}
});

//Confirm Account
router.get("/confirmAccount/:email", async (req, res) => {
  let email = req.params.email;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      user.contaConfirmada = true;
      user.save();
      res.redirect("/login");
    } else {
      //ToDo
    }
  });
});

//Login handle
router.post("/login", (req, res, next) => {
  const password = req.body.password.toString();
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res
          .status(401)
          .json({
            success: false,
            message:
              "Utilizador não encontrado, por favor verifique o seu mail e password",
          });
      }
      if (user.contaConfirmada) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch && user.aprovado === "Aprovado") {
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({
              success: true,
              user: user,
              token: tokenObject.token,
              expiresIn: tokenObject.expires,
            });
          } else {
            res
              .status(401)
              .json({ success: false, message: "Password Incorreta" });
          }
        });
      } else {
        let msg = "";
        if (user.tipoMembro == "Voluntario Interno")
          msg =
            "Ainda não confirmou a sua conta através do email. Por favor verifique o seu email.";
        if (user.tipoMembro == "Voluntario Externo")
          msg = "A sua conta ainda não foi validada pelo administrador.";
        res.status(401).json({ success: false, msg: msg });
      }
    })
    .catch((err) => {
      next(err);
    });
});

////////////////////////
router.post("/profile", (req, res, next) => {
  if (req.body.authorization) {
    var authorization = req.body.authorization.split(" ")[1],
      decoded;
    try {
      decoded = jwt.verify(authorization, PUB_KEY);
      var userId = decoded.sub;
    } catch (e) {
      return res.sendStatus(401);
    }
    User.findOne({ _id: userId })
      .then(function (user) {
        res.send({ success: true, user: user });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    return res.sendStatus(500);
  }
});

router.post("/edit_user", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          success: false,
          message:
            "Utilizador não encontrado, porfavor verifique o seu mail e password",
        });
      }
      if (req.body.password) {
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            //set Password to hashed
            user.password = hash;
          })
        );
      }
      for (const key in req.body) {
        if (key === "password") {
          continue;
        }
        user[key] = req.body[key];
      }
      user.save().then((user) => {
        res.status(200).json({ success: true, user: user });
      });
    })
    .catch((err) => {
      //next(err);
    });
});

router.get("/userAprove", (req, res) => {
  User.find({ aprovado: "Em Espera" }).then((users) => {
    res.json(users);
  });
});

router.post("/avaliarUser", (req, res) => {
  const email = req.body.email;
  const aprovado = req.body.aprovado;
  user = User.updateOne({ email: email }, { aprovado: aprovado }, function (
    err,
    doc
  ) {
    if (err)
      res
        .status(500)
        .json({ success: false, message: "Erro a aprovar Utilizador" });
    User.findOne({ email: email })
      .then((user) => {
        res.json(user);
      })
      .catch(() => {
        res
          .status(500)
          .json({ success: false, msg: "Erro a aprovar Utilizador" });
      });
  });
});

router.post("/alter_password", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res
          .status(401)
          .json({
            success: false,
            message:
              "Utilizador não encontrado, porfavor verifique o seu email",
          });
      } else {
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            //set Password to hashed
            user.password = hash;
            //save user
            user.save().then((user) => {
              res.status(200).json({ success: true, user: user });
            });
          })
        );
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/externos", (req, res) => {
  User.find({ tipoMembro: "Voluntario Externo" }).then((users) => {
    res.json(users);
  });
});

router.post("/currentUser", (req, res) => {
  if (req.body.token) {
    res
      .status(200)
      .json({ success: true, UserID: utils.getCurrentUserId(req.body.token) });
  } else
    res.status(400).json({
      success: false,
      msg: "Não existe um token associado ao request",
    });
});

module.exports = router;
