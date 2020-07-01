const express = require("express");
const router = express.Router();
const Project = require("../models/mongoConnection").Projeto;
const User = require("../models/mongoConnection").Utilizadores;
const PublicoAlvo = require("../models/mongoConnection").PublicoAlvo;
const Inscricao = require("../models/mongoConnection").Inscricao;
const mongoose = require("mongoose");
const { forEachChild } = require("typescript");


router.post("", (req, res) => {
  const {
    nome,
    responsavelId,
    resumo,
    formacoesNecessarias,
    dataTermino,
    dataComeco,
    dataFechoInscricoes,
    nrVagas,
    gestoresIds,
    XemXTempo,
    selectedAreas,
    atividades,
    restringido,
  } = req.body;

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
        atividades: atividades,
        vagas: nrVagas,
        projetoMes: false,
        dataCriacao: Date.now(),
        dataTermino: dataTermino,
        dataFechoInscricoes: dataFechoInscricoes,
        dataComeco: dataComeco,
        areasInteresse: selectedAreas,
        voluntarios: new Array(),
        restringido: restringido,
      });
      newProject.save().then((project) => {
        res.status(200).json({ success: true, projetoId: project._id });
      });
    }
  });
});

//update
router.put('/:id', (req, res) => {
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

//get one
router.get('/:id', (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  Project.findOne({ _id: projectId }).then((project) => {
    res.json(project);
  })
})

//get all
router.get('', (req, res) => {
  Project.find({}).then((projects) => {
    res.json(projects);
  })
})

router.delete('/:id', (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  Project.findByIdAndDelete(projectId).then(project => res.json(project));
})

//get favorits of user
router.get('/favoriteProject/:userId', (req, res) => {
  const u = req.params['userId']
  let userId = mongoose.Types.ObjectId(u);

  User.findById(userId).then((user) => {
    res.json({ projetos: user.projetosFavoritos });

  }).catch((err) => console.log(err));
})

router.get('/registerProject/:userId', (req, res) => {
  const u = req.params['userId'];
  Inscricao.find({ utilizadorId: u }).then((inc) => {
    res.json(inc)

  }).catch((err) => console.log(err));
})

router.put('/anularCandidatura/:id', (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  let voluntarioId = req.body.voluntarioId;
  Project.findOne({ _id: projectId }).then((project) => {
    let index;
    let voluntarios = project["voluntarios"]
    for (i = 0; i < voluntarios.length; i++) {
      if (voluntarios[i].userId === voluntarioId) {
        index = i;
        break;
      }
    }
    if (typeof Number(index)) {
      voluntarios.splice(index, 1);
      project.save().then(() => {
        res.status(200).json({ success: true, msg: "Anulou a candidatura" });
      }).catch(err => {
        console.log(err);
        res.status(500).json({ success: false, msg: "Falha a guardar Projeto" });
      });
    } else {
      res.status(404).json({ success: false, msg: "Voluntario Não encontrado" });
    }
  }).catch((err) => {
    console.log(err);
    res.status(404).json({ success: false, msg: "Projeto Não encontrado" });
  });
});

router.put('/candidatar/:id', (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  let voluntarioId = req.body.voluntarioId;
  console.log(req.body);
  console.log(projectId)
  console.log(voluntarioId);
  Project.findOne({ _id: projectId }).then((project) => {
    let vagas = project["vagas"]
    let voluntarios = project["voluntarios"];
    let voluntario;
    if (project.restringido) {
      voluntario = { userId: voluntarioId, estado: "Em Espera" };
    } else
      voluntario = { userId: voluntario, estado: "Aprovado" };
    if (voluntarios.length + 1 < vagas) {
      if (voluntario !== undefined) {
        voluntarios.push(voluntario);
        project.save().then(() => {
          res.status(200).json({ success: true, msg: "Voluntario candidatado com sucesso" })
        }).catch((err) => {
          console.log(err);
          res.status(500).json({ success: false, msg: "Falha ao guardar projeto" });
        })
      } else {
        res.status(500).json({success:false,msg:"Algo aconteceu de errado"});
      }
    }else
      res.status(500).json({ success: false, msg: "O projeto não tem mais vagas para preencher" })

  }).catch((err) => {
    console.log(err);
    res.status(404).json({ success: false, msg: "Não existe um projeto com esse ID" })
  });
});


router.get("/gestores/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  Project.findOne({ _id: projectId }).then(project => {
    User.find({ '_id': { $in: project.gestores } }).then(users => res.status(200).json({ success: true, gestores: users }))
      .catch(err => res.status(404).json({ success: false, err: err }));
  }).catch(err => res.status(500).json({ success: false, err: err }));
});

module.exports = router;