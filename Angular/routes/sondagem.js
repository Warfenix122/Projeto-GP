const express = require("express");
const mongoose = require('mongoose');
var router = express.Router();
const Sondagem = require('../models/mongoConnection').Sondagem;
const Resposta = require('../models/mongoConnection').Resposta;

router.get('/:id', (req, res) => {
  let sondagemId = mongoose.Types.ObjectId(req.params.id);
  Sondagem.findOne({ _id: sondagemId }).then((sondagem) => {
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

router.post('/answer', (req, res) => {
  console.log('req.body :>> ', req.body);

  if (req.body['userId']) {
    let newResp = new Resposta({
      userId: req.body['userId'],
      sondagemId: req.body['sondagemId'],
      opcoes: req.body['options'],
      outraResposta: req.body['outro']
    })

    newResp.save((err) => {
      if (err) res.json({ success: false, err: err });
      res.status(200).json({ success: true })
    })
  } else {
    res.status(401).json({ success: true, message: 'No user given' });
  }

})

module.exports = router;
