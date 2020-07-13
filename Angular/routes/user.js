const express = require("express");
const router = express.Router();
const Project = require("../models/mongoConnection").Projeto;
const User = require("../models/mongoConnection").Utilizadores;
const mongoose = require("mongoose");
const { forEachChild } = require("typescript");

//api/user

//adicionar projeto favorito  /api/user/userId
router.put('/:id', (req, res) => {
    let userId = mongoose.Types.ObjectId(req.params.id);
    let purpose = req.query.purpose;
    let projectId = mongoose.Types.ObjectId(req.body.projectId);
    if (purpose == "pushFavProject")
        User.updateOne({ _id: userId }, { $push: { projetosFavoritos: projectId } }).then((user) => res.json(user));
    else if (purpose == "removeFavProject")
        User.updateOne({ _id: userId }, { $pullAll: { projetosFavoritos: [projectId] } }).then((user) => res.json(user));
    else
        User.updateOne({ _id: userId }, req.body).then((user) => res.json(user));
});

router.get('/:id', (req, res) => {
    let userId = mongoose.Types.ObjectId(req.params.id);
    User.findById(userId).then((user) => res.json(user));
});
router.get('/gestores', (req, res) => {
  User.find({ tipoMembro: "Gestor" }).then((users) =>
    res.status(200).json({ success: true, gestores: users })
  )
    .catch((err) => res.status(404).json({ success: false, err: err }));
});
router.get('', (req, res) => {
    let usersId = req.query.ids;
    if (usersId) {
        User.find({ '_id': { $in: usersId } }, (err, users) => {
            res.json(users);
        })
    } else {
        User.find({}, (err, users) => {
            res.json(users);
        })
    }
})

module.exports = router;
