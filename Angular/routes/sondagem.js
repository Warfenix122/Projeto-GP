const express = require("express");
const mongoose = require('mongoose');
var router = express.Router();
const Sondagem = require('../models/mongoConnection').Sondagem;
const Resposta = require('../models/mongoConnection').Resposta;

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