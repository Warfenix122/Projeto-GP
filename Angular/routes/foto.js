const Foto = require("../models/mongoConnection").Foto;
const mongoose = require("mongoose");
const express = require("express");
var router = express.Router();


router.get('', (req, res) => {
  let fotoIds = req.query.ids;
  let type = req.query.type;
  if (fotoIds) {
    Foto.find({ '_id': { $in: fotoIds }, 'type': type }, (err, fotos) => {
      res.json(fotos);
    })
  } else if (type) {
    Foto.find({ 'type': type }, (err, fotos) => {
      res.json(fotos);
    })
  }
})

module.exports = router;
