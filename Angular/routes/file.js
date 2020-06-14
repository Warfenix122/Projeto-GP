const express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const FotoPerfil = require("../models/mongoConnection").FotoPerfil;
const FotoCapa = require("../models/mongoConnection").FotoCapa;
const User = require("../models/mongoConnection").Utilizadores;
var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

router.post("/uploadProfilePhoto", upload.single("file"), (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.status(401).json({ success: false, message: "Erro no servidor" });
    } else {
      let id = user._id;

      FotoPerfil.findOne({ userId: id })
        .then((foto) => {
          var bin = fs.readFileSync(
            path.join(
              path.dirname(require.main.filename) +
                "/uploads/" +
                req.file.filename
            )
          );
          var newPhoto = new FotoPerfil({
            userId: user._id,
            foto: { data: bin, contentType: "image/png" },
          });
          if (foto) {
            FotoPerfil.deleteOne({ userId: id }, () => {
              res.contentType("json");
              res.json({
                success: false,
                message: "Dificuldades a alterar imagem",
              });
            });
          }
          newPhoto
            .save()
            .then((newPhoto) => {
              res.contentType("json");
              res.json({
                success: true,
                message: "Imagem Guardada com Sucesso!",
              });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.post("/getProfilePhoto", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      let id = user._id;
      FotoPerfil.findOne({ userId: id }).then((foto) => {
        if (foto) {
          res.contentType("json");
          res.status(200).json({ success: true, foto: foto.foto.data });
        } else {
          var img = fs.readFileSync(
            path.join(
              path.dirname(require.main.filename) + "/src/assets/img/user.png"
            )
          );
          res.contentType("json");
          res.status(200).json({ success: true, foto: img });
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Erro a encontrar o senho utilizador, faça login de novo",
      });
    }
  });
});

router.post("/uploadCapaFoto", upload.single("file"), (req, res) => {
  let id = req.body.projetoId;
  FotoCapa.find({ projetoId: id }).then((foto) => {
    var bin = fs.readFileSync(
      path.join(
        path.dirname(require.main.filename) + "/uploads/" + req.file.filename
      )
    );
    var newPhoto = new FotoCapa({
      projetoId: id,
      foto: { data: bin, contentType: "image/png" },
    });
    if (foto) {
      FotoCapa.deleteOne({ projetoId: id }).catch((err) => {
        res
          .status(500)
          .json({ success: false, message: "Dificuldade em Remover a foto" });
      });
    }
    newPhoto
      .save()
      .then((newCapa) => {
        //res.contentType("json");
        res.send({ success: true, msg: "Imagem Guardada com sucesso" });
      })
      .catch((err) => console.log(err));
  });
});
module.exports = router;
