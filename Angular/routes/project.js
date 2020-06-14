const Project = require("../models/mongoConnection").Projeto;
const PublicoAlvo = require("../models/mongoConnection").PublicoAlvo;
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("", (req, res) => {
  const {
    nome,
    responsavelId,
    resumo,
    publicoAlvo,
    formacoesNecessarias,
    dataTermino,
    dataComeco,
    formacao,
    dataFechoInscricoes,
    nrVagas,
    gestoresIds,
    XemXTempo,
    selectedAreas,
    atividades,
  } = req.body;

  PublicoAlvo.find({ descricao: publicoAlvo }).then((publicoAlvo) => {
    if (publicoAlvo) {
      existingPublicoAlvo = publicoAlvo;
    } else {
      const newPublicoAlvo = new PublicoAlvo({
        descricao: publicoAlvo,
        predefinido: false,
      });
      newPublicoAlvo.save().then((publicoAlvo) => {
        publicoAlvo = publicoAlvo.id;
      });
    }
  });

  Project.findOne({ nome: nome }).then((project) => {
    if (project) {
      res.status(409).send("Já existe um projeto com esse nome");
    } else {
      const newProject = new Project({
        nome: nome,
        resumo: resumo,
        responsavelId: responsavelId,
        formacoesNecessarias: formacoesNecessarias,
        XemXTempo: XemXTempo,
        gestores: gestoresIds,
        formacoesNecessarias: formacao,
        atividades: atividades,
        vagas: nrVagas,
        projetoMes: false,
        dataCriacao: Date.now(),
        dataTermino: dataTermino,
        dataFechoInscricoes: dataFechoInscricoes,
        dataComeco: dataComeco,
        areasInteresse: selectedAreas,
      });
      newProject.save().then((project) => {
        res.status(200).json({ success: true, projetoId: project._id });
      });
    }
  });
});

//update
router.put("/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  project = Project.updateOne({ _id: projectId }, req.body, (err, doc) => {
    if (err) res.status(500).json({ success: false, msg: err.message });
    else {
      Project.findOne({ _id: projectId }).then((project) => {
        res.json(project);
      });
    }
  });
});

router.get("/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  Project.findOne({ _id: projectId }).then((project) => {
    res.json(project);
  });
});

router.get("", (req, res) => {
  Project.find({}).then((projects) => {
    res.json(projects);
  });
});

module.exports = router;
