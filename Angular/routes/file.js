const express = require("express");
var router = express.Router();
const fs = require('fs');
const path = require('path');
const FotoPerfil = require('../models/mongoConnection').FotoPerfil;
const FotoCarrosel = require('../models/mongoConnection').FotoCarrosel;
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
        let id = user._id;

        FotoPerfil.findOne({ userId: id }).then((foto) => {
          var bin = fs.readFileSync(path.join(path.dirname(require.main.filename) + '/uploads/' + req.file.filename));
          var newPhoto = new FotoPerfil({
            userId: user._id,
            foto: { data: bin, contentType: 'image/png' }
          });
          if (foto) {
            FotoPerfil.deleteOne({ userId: id }, (err) => {
              if (err) {
                res.status(500).json({ success: false, message: 'Dificuldades a alterar imagem' });
              }
            });
          }
          newPhoto.save()
            .then((newPhoto) => {
              res.status(200).json({ success: true, message: 'Imagem Guardada com Sucesso!' });
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
      let id = user._id;
      FotoPerfil.findOne({ userId: id }).then((foto) => {
        if (foto) {
          res.status(200).json({ success: true, foto: foto.foto.data });
        } else {
          var img = fs.readFileSync(path.join(path.dirname(require.main.filename) + '/src/assets/img/user.png'));
          res.status(200).json({ success: true, foto: img });
        }
      });
    } else {
      res.status(500).json({ success: false, message: 'Erro a encontrar o senho utilizador, faça login de novo' });
    }
  });

});


router.post("/uploadCarrouselPhoto", upload.single('file'), (req, res, next) => {
  var bin = fs.readFileSync(path.join(path.dirname(require.main.filename) + '/uploads/' + req.file.filename));
  FotoCarrosel.find({ 'foto.data': bin }).then((items) => {
    res.status(500).json({ success: false, message: 'Imagem já inserida!' });
  }).catch((err) => console.log(err));

  var newPhoto = new FotoCarrosel({
    foto: { data: bin, contentType: 'image/png' }
  });

  newPhoto.save()
    .then((newPhoto) => {
      res.status(200).json({ success: true, message: 'Imagem Guardada com Sucesso!' });
    })
    .catch((err) => console.log(err));
})

router.post("/getAllCarrouselPhotos", (req, res, next) => {

  FotoCarrosel.find({ 'foto.contentType': "image/png" }).then((items) => {
    console.log('items :>> ', items);
    res.status(200).json({ success: true, fotos: items });

  }).catch((err) => console.log(err));

})


router.post("/deleteCarrouselPhoto", (req, res, next) => {
  FotoCarrosel.deleteOne({ '_id': req.body.src }).then((err) => {
    if (err) {
      console.log('err :>> ', err);
      res.status(500).json({ success: false, message: 'Dificuldades a alterar imagem' });
    }
  });
  res.status(200).json({ success: true, message: "sucesso" });


})
module.exports = router;
