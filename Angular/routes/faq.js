const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Faq } = require("../models/mongoConnection");

router.get('/', (req, res) => {
    Faq.find({}).then((faqs) => {
      res.json(faqs);
    }).catch(err=>console.log(err));
})

module.exports = router;