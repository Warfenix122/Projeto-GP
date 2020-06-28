const Foto = require("../models/mongoConnection").Foto;
const mongoose = require("mongoose");
const express = require("express");
const { arrayify } = require("tslint/lib/utils");
var router = express.Router();


router.get('', (req, res) => {
    let fotoIds = req.query.ids;
    let type = req.query.type;
    if (fotoIds) {
        if (Array.isArray(fotoIds)) {
            Foto.find({ '_id': { $in: fotoIds } }, (err, foto) => {}).then((f) => {
                res.json(f);
            })

        } else {
            Foto.findOne({ '_id': fotoIds, 'type': type }, (err, foto) => {
                res.json(foto);
            })
        }

    }
})

module.exports = router;
