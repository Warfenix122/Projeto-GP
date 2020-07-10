const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Faq } = require("../models/mongoConnection");

router.get('/', (req, res) => {
    Faq.find({}).then((faqs) => {
      res.json(faqs);
    }).catch(err=>console.log(err));
})

//adicionar faq
router.put('/addFaq', (req, res) => {
  console.log(req.body);
  var pergunta = req.body.pergunta;
  var resposta = req.body.resposta;

    const newFaq = new Faq({
        pergunta: pergunta,
        resposta: resposta,
      });
      newFaq.save().then(() => {
        res.status(200).json({ success: true, faqId: newFaq._id });
      });
})

//editar faq
router.put('/edit/:id', (req, res) => {
    let faqId = mongoose.Types.ObjectId(req.params.id);
    faq = Faq.updateOne({ _id: faqId }, req.body, (err, doc) => {
      if (err) res.status(500).json({ success: false, msg: err.message });
      else {
        Faq.findOne({ _id: faqId }).then((faq) => {
          res.json(faq);
        });
      }
    });
});

//apagar faq
router.delete('/delete/:id', (req, res) => {
    let faqId = mongoose.Types.ObjectId(req.params.id);
    Faq.findByIdAndDelete(faqId).then(faq => res.json(faq));
})

module.exports = router;