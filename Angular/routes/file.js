const express = require("express");
var router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/mongoConnection').Utilizadores;
var multer = require('multer');
const { Foto, Projeto } = require("../models/mongoConnection");
const mongoose = require("mongoose");


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

var upload = multer({ storage: storage });

router.post("/uploadPhoto", upload.single("file"), (req, res) => {
    var file = fs.readFileSync(
        path.join(
            path.dirname(require.main.filename) + "/uploads/" + req.file.filename
        )
    );
    var newPhoto = new Foto({
        foto: { data: file, contentType: "image/png" },
        type: req.body.type
    });
    newPhoto
        .save()
        .then((foto) => {
            res.send({ success: true, fotoId: foto._id, msg: "Imagem Guardada com sucesso" });
        })
        .catch((err) => console.log(err));

});

router.put("/updateUserPhoto/:userId", (req, res) => {
    User.findOne({ _id: req.params.userId }).then((user) => {
        user.fotoPerfilId = req.body.fotoId;
        user.save().then((user) => {
            res.send({ success: true, user: user, msg: "Imagem Guardada com sucesso" });
        })
    }).catch((err) => console.log(err));

})
router.put("/updateProjectCover/:projectId", (req, res) => {
    Projeto.findOne({ _id: req.params.projectId }).then((proj) => {
        proj.fotoCapaId = req.body.fotoId;
        proj.save().then((pr) => {
            res.send({ success: true, project: pr, msg: "Imagem Guardada com sucesso" });
        })
    }).catch((err) => console.log(err));

})
router.put("/updateProjectPhotos/:projectId", (req, res) => {
    Projeto.findOne({ _id: req.params.projectId }).then((proj) => {
        proj.fotosId.push(req.body.fotoId);

        proj.save().then((pr) => {
            res.send({ success: true, project: pr, msg: "Imagem Guardada com sucesso" });
        })
    }).catch((err) => console.log(err));

})



router.delete("/deletePhoto/:id", (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    try {
        Foto.deleteOne({ '_id': id }).then(() => {
            res.status(200).json({ success: true, message: "sucesso" });
        })
    } catch (e) {
        console.log('e :>> ', e);
    }
});

router.delete("/deleteProfilePhoto/:userid/:fotoId", (req, res) => {
    User.updateOne({ '_id': req.params.userid }, { $unset: { 'fotoPerfilId': req.params.fotoId } }).then((err) => {
        if (err) {
            console.log('err :>> ', err);
            res.status(500).json({ success: false, message: 'Dificuldades a alterar imagem' });
        } else {
            res.status(200).json({ success: true, message: "sucesso" });

        }
    })
});

router.delete("/deleteCoverPhoto/:projectid/:fotoId", (req, res) => {
    Projeto.updateOne({ '_id': req.params.projectid }, { $unset: { 'fotoCapaId': req.params.fotoId } }).then((err) => {
        if (err) {
            console.log('err :>> ', err);
            res.status(500).json({ success: false, message: 'Dificuldades a alterar imagem' });
        } else {
            res.status(200).json({ success: true, message: "sucesso" });

        }
    });
});


router.delete("/deleteProjectPhoto/:projectid/:fotoid", (req, res) => {
    Projeto.updateOne({ '_id': req.params.projectid }, { $pull: { 'fotoIds': req.params.fotoId } }).then((err) => {
        if (err) {
            console.log('err :>> ', err);
            res.status(500).json({ success: false, message: 'Dificuldades a alterar imagem' });
        } else {
            res.status(200).json({ success: true, message: "sucesso" });

        }
    })
});

module.exports = router;
