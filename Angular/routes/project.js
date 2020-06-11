const express = require("express");
const mongoose = require("mongoose");
const { forEachChild } = require("typescript");
var router = express.Router();
const Project = require('../models/mongoConnection').Projeto;

//update
router.put('/:id', (req, res) => {
    let projectId = mongoose.Types.ObjectId(req.params.id);
    project = Project.updateOne({ _id : projectId}, req.body, (err, doc) => {
      if (err) res.status(500).json({ success: false, msg: err.message});
      else {
      Project.findOne({ _id : projectId}).then((project) => {
        res.json(project);
      });
    }
    })
});

//get one
router.get('/:id', (req, res) => {
    let projectId = mongoose.Types.ObjectId(req.params.id);
    Project.findOne({ _id : projectId}).then((project) => {
        res.json(project);
    })
})

//get all
router.get('', (req, res) => {
    Project.find({}).then((projects) => {
        res.json(projects);
    })
})

module.exports = router;