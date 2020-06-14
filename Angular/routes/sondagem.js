const express = require("express");
const mongoose = require('mongoose');
var router = express.Router();
const Sondagem = require('../models/mongoConnection').Sondagem;
//Meter a respostaSondagem do mongoconnection aqui

router.get('/:id', (req, res) => {
    let sondagemId = mongoose.Types.ObjectId(req.params.id);
    Sondagem.findOne({_id : sondagemId}).then((sondagem) => {
        res.json(sondagem);
    })
})

router.get('', (req, res) => {
    Sondagem.find({}).then((sondagens) => {
        res.json(sondagens);
    })
})

router.post('', (req, res) => {
    let novaSondagem = req.body;
    //Inserir na BD a novaSondagem
})

module.exports = router;