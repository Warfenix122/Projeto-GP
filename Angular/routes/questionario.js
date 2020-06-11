const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Questionario = require('../models/mongoConnection').Questionario;

router.get('/:id'), (req, res) => {
    let questionarioId = mongoose.Types.ObjectId(req.params.id);
    Questionario.findOne({_id : questionarioId}).then((questionario) => {
        res.json(questionario);
    })
}

router.get(''), (req, res) => {
    Questionario.find({}).then((questionarios) => {
        res.json(questionarios);
    })
}

module.exports = router;