const express = require("express");
var router = express.Router();
const fs = require('fs');
const path = require('path');
const Foto = require('../models/mongoConnection').Foto;
const User = require('../models/mongoConnection').Utilizadores;
var multer = require('multer');


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

router.post("/uploadProfilePhoto", upload.single('file'), (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, message: "Erro no servidor" });
      } else {
        let userEmail = user.email;

        Foto.findOne({ userEmail: userEmail }).then((foto) => {
          var bin = fs.readFileSync(path.join(path.dirname(require.main.filename) + '/uploads/' + req.file.filename));
          var newPhoto = new Foto({
            userEmail: user.email,
            foto: { data: bin, contentType: 'image/png' }
          });
          if (foto) {
            Foto.deleteOne({ userEmail: userEmail }, () => {
              res.contentType('json');
              res.json({ success: false, message: 'Dificuldades a alterar imagem' });
            });
          }
          newPhoto.save()
            .then((newPhoto) => {
              res.contentType('json');
              res.json({ success: true, message: 'Imagem Guardada com Sucesso!' });
            })
            .catch((err) => console.log(err));

        })
          .catch((err) => {
            next(err);
          });
      }
    })
})

router.post('/getProfilePhoto', (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      let userEmail = user.email;
      Foto.findOne({ userEmail: userEmail }).then((foto) => {
        if (foto) {
          res.contentType('json');
          res.status(200).json({ success: true, foto: foto.foto.data });
        } else {
          var img = fs.readFileSync(path.join(path.dirname(require.main.filename) + '/src/assets/img/user.png'));
          res.contentType('json');
          res.status(200).json({ success: true, foto: img });
        }
      });
    } else {
      res.status(500).json({ success: false, message: 'Erro a encontrar o senho utilizador, faça login de novo' });
    }
  });

});
module.exports = router;
