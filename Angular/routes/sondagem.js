const express = require("express");
const mongoose = require('mongoose');
const { map } = require("jquery");
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

router.get('/unanswered/:userId', (req, res) => {
  Resposta.find({ userId: req.params.userId }).then((respostas) => {
    Sondagem.find({}).then((sondagens) => {
      let answeredId = Array();
      respostas.forEach(e => answeredId.push(e.sondagemId.toString()))
      let unanswerd = sondagens.filter(e => {
        if (e) {
          if (!answeredId.includes(e.id.toString())) {
            return e
          }
        }
      });
      res.json(unanswerd);
    })
  })
})
router.get('/answered/:userId', (req, res) => {
  Resposta.find({ userId: req.params.userId }).then((respostas) => {
    Sondagem.find({}).then((sondagens) => {
      let answeredId = Array();
      respostas.forEach(e => answeredId.push(e.sondagemId.toString()))
      let answerd = sondagens.filter(e => {
        if (answeredId.includes(e.id.toString())) {
          return e
        }
      });
      res.json(answerd);
    })
  })
})

router.post('', (req, res) => {
  let sond = new Sondagem({
    descricao: req.body['descricao'],
    opcoes: req.body['opcao'],
     titulo: req.body['titulo'],

  })
  sond.save((err) => {
    if (err) res.json({ success: false, err: err });
    res.status(200).json({ success: true })
  })
});

router.post('/answer', (req, res) => {

  if (req.body['userId']) {
    let newResp = new Resposta({
      userId: req.body['userId'],
      sondagemId: req.body['sondagemId'],
      opcoes: req.body['options'],
      outraResposta: req.body['outro']
    })

    newResp.save((err, doc) => {
      if (err) res.json({ success: false, err: err });
      res.status(200).json({ success: true, answer: doc })
    })
  } else {
    res.status(401).json({ success: true, message: 'No user given' });
  }

})

module.exports = router;
