const Foto = require("../models/mongoConnection").Foto;
const mongoose = require("mongoose");
const express = require("express");
var router = express.Router();

const convertFromStringToObjectId = (ids) => {
    let objectIds = [];
    ids.forEach((elem) => {
        objectIds.push(mongoose.Types.ObjectId(elem))
    })
    return objectIds;
}

//get one
router.get('', (req, res) => {
    let query = req.query.ids;
    let fotoIds = [];
    if(query != "")
        fotoIds = query.split(",");
    let objectIds = convertFromStringToObjectId(fotoIds);
    Foto.find({'_id': { $in: objectIds}}, (err, fotos) => {
        console.log(fotos);
        res.json(fotos);
    })
})

module.exports = router;