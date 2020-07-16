const express = require("express");
const router = express.Router();
const Project = require("../models/mongoConnection").Projeto;
const User = require("../models/mongoConnection").Utilizadores;
const PublicoAlvo = require("../models/mongoConnection").PublicoAlvo;
const Inscricao = require("../models/mongoConnection").Inscricao;
const mongoose = require("mongoose");
const { promises } = require("dns");

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
        projetoMes: { state: false },
        dataCriacao: Date.now(),
        dataTermino: dataTermino,
        dataFechoInscricoes: dataFechoInscricoes,
        dataComeco: dataComeco,
        areasInteresse: selectedAreas,
        voluntarios: new Array(),
        restringido: restringido,
        aprovado: "Em Espera",
      });
      newProject.save().then((project) => {
        res.status(200).json({ success: true, projetoId: project._id });
      });
    }
  });
});

//update
router.put("/edit/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  project = Project.updateOne({ _id: projectId }, req.body, (err, doc) => {
    if (err)
      res.status(500).json({ success: false, msg: "Projeto Não encontrado" });
    else {
      Project.findOne({ _id: projectId }).then((project) => {
        res.json(project);
      });
    }
  });
});

//get one
router.get("/getProject/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  Project.findOne({ _id: projectId }).then((project) => {
    res.json(project);
  });
});

router.get("/getProjects", (req, res) => {
  let projectsId = req.query.ids;
  Project.find({ '_id': { $in: projectsId } }, (err, project) => {}).then((p) => {
    res.json(p);
  })
});

//get all
router.get("", (req, res) => {
  Project.find({}).then((projects) => {
    res.json(projects);
  });
});

router.get("/aprovedProjects", (req, res) => {
  Project.find({ aprovado: "Aprovado" }).then(projects => {
    res.status(200).json(projects);
  })
})

router.delete("/getProject/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  Project.findByIdAndDelete(projectId).then((project) => res.json(project));
});

//get favorits of user
router.get("/favoriteProject/:userId", (req, res) => {
  const u = req.params["userId"];
  let userId = mongoose.Types.ObjectId(u);

  User.findById(userId)
    .then((user) => {
      res.json({ projetos: user.projetosFavoritos });
    })
    .catch((err) => console.log(err));
});

router.get("/registerProject/:userId", (req, res) => {
  const u = mongoose.Types.ObjectId(req.params["userId"]);
  Project.find({ voluntarios: { $elemMatch: { userId: u } } })
    .then((proj) => {
      res.status(200).json(proj);
    })
    .catch((err) => console.log(err));
});

router.put("/anularCandidatura/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  let voluntarioId = req.body.voluntarioId;
  Project.findOne({ _id: projectId })
    .then((project) => {
      let index = undefined;
      let voluntarios = project["voluntarios"];
      for (i = 0; i < voluntarios.length; i++) {
        if (voluntarios[i].userId == voluntarioId) {
          index = i;
          break;
        }
      }
      if (typeof Number(index)) {
        voluntarios.splice(index, 1);
        project
          .save()
          .then(() => {
            res
              .status(200)
              .json({ success: true, msg: "Anulou a candidatura" });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .json({ success: false, msg: "Falha a guardar Projeto" });
          });
      } else {
        res
          .status(404)
          .json({ success: false, msg: "Voluntario Não encontrado" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ success: false, msg: "Projeto Não encontrado" });
    });
});

router.put("/candidatar/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  let voluntarioId = req.body.userId;
  Project.findOne({ _id: projectId })
    .then((project) => {
      let vagas = project["vagas"];
      let voluntarios = project["voluntarios"];
      let voluntario;
      if (project.restringido) {
        voluntario = { userId: voluntarioId, estado: "Em Espera" };
      } else voluntario = { userId: voluntarioId, estado: "Aprovado" };
      if (voluntarios.length < vagas) {
        if (voluntario !== undefined) {
          voluntarios.push(voluntario);
          project
            .save()
            .then(() => {
              res
                .status(200)
                .json({
                  success: true,
                  msg: "Voluntario candidatado com sucesso",
                });
            })
            .catch((err) => {
              console.log(err);
              res
                .status(500)
                .json({ success: false, msg: "Falha ao guardar projeto" });
            });
        } else {
          res
            .status(500)
            .json({ success: false, msg: "Algo aconteceu de errado" });
        }
      } else
        res
          .status(500)
          .json({
            success: false,
            msg: "O projeto não tem mais vagas para preencher",
          });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(404)
        .json({ success: false, msg: "Não existe um projeto com esse ID" });
    });
});

router.get("/gestores/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  Project.findOne({ _id: projectId }).then((project) => {
    User.find({ _id: { $in: project.gestores } })
      .then((users) =>
        res.status(200).json({ success: true, gestores: users })
      )
      .catch((err) => res.status(404).json({ success: false, err: err }));
  })
    .catch((err) => res.status(500).json({ success: false, err: err }));
});


router.get("/pendingProjects", (req, res) => {
  Project.find({ aprovado: "Em Espera" })
    .then((projects) => {
      res.status(200).json({ success: true, projetos: projects });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, msg: err });
    });
});

router.put("/avaliarProjeto", (req, res) => {
  let projectId = req.body.projectId;
  let aprovado = req.body.aprovado;
  Project.findOneAndUpdate({ _id: projectId }, { aprovado: aprovado })
    .then(() => {
      res.status(200).json({ success: true, msg: "Avaliação Completa" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ success: false, msg: "Não foi possivel avaliar o projeto" });
    });
});

router.get("/comments/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  Project.findOne({ _id: projectId })
    .then((project) => {
      res.status(200).json({ comments: project.comentarios });
    })
    .catch((err) => res.status(500).json({ msg: err }));
});

router.put("/addComment/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  let comment = req.body.comentario;
  let utilizadorId = req.body.utilizadorId;
  Project.findOne({ _id: projectId })
    .then((project) => {
      project.comentarios.push({
        comentario: comment,
        utilizadorId: utilizadorId,
        dataCriacao: Date.now(),
      });
      let comentario = project.comentarios[project.comentarios.length - 1];
      project.save();
      res
        .status(200)
        .json({
          success: true,
          msg: "Obrigado por comentar!",
          insertedComment: comentario,
        });
    })
    .catch((err) => res.status(500).json({ success: false, msg: err }));
});

router.put("/removeComment/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  let commentId = req.body.commentId;
  Project.updateOne(
    { _id: projectId },
    { $pull: { comentarios: { _id: commentId } } }
  )
    .then((project) => {
      res
        .status(200)
        .json({ success: true, msg: "Comentario removido com sucesso" });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, msg: "Projeto Não foi encontrado" })
    );
});

router.get("/writeFile/:id", (req, res) => {
  let projectId = req.params.id;
  Project.findOne({ _id: projectId })
    .then((project) => {
      var voluntarios = project["voluntarios"].filter(
        (vol) => vol.estado === "Aprovado"
      );
      let data = [];
      if (voluntarios) {
        processArray(voluntarios).then((data) => {
          res.json({ success: true, msg: "Dados exportados", data: data });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: err });
    });
});
router.get("/markTop/:id/:position", (req, res) => {
  let projectId = req.params.id;
  let position = req.params.position;
  Project.findOne({ _id: projectId })
    .then((project) => {
      project.projetoMes = { state: true, position: position };
      project.save();
      res
        .status(200)
        .json({
          success: true,
          msg: "Projeto Marcado como top!",
          project: project,
        });
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: err });
    });
});
router.get("/dismarkTop/:id", (req, res) => {
  let projectId = req.params.id;
  Project.findOne({ _id: projectId })
    .then((project) => {
      project.projetoMes = { state: false };
      project.save();
      res
        .status(200)
        .json({
          success: true,
          msg: "Projeto desarcado como top!",
          project: project,
        });
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: err });
    });
});

router.get("/atividades/:id", (req, res) => {
  let projectID = mongoose.Types.ObjectId(req.params.id);
  Project.findById(projectID)
    .then((project) => {
      res.status(200).json({ success: true, atividades: project.atividades });
    })
    .catch((err) => res.status(404).json({ success: false, msg: err }));
});

router.put("/atividades/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  let atividadeId = req.body._id;
  let descricao = req.body.descricao;
  let dataAcontecimento = req.body.dataAcontecimento;
  Project.findOneAndUpdate(
    { _id: projectId, atividades: { $elemMatch: { _id: atividadeId } } },
    {
      $set: {
        "atividades.$.descricao": descricao,
        "atividades.$.dataAcontecimento": dataAcontecimento,
      },
    }
  ).then(project => {
    res.status(200).json({ success: true, msg: "Atividade Alterada com sucesso" });
  }).catch(err => {
    res.status(404).json({ success: false, msg: "Atividade não encontrada" })
  });
});

router.put("/atividades/remover/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  let atividadeId = req.body.atividadeId;
  console.log(req.body);
  Project.findByIdAndUpdate({ _id: projectId }, { $pull: { atividades: { _id: atividadeId } } }).
    then(projeto => {
      res.status(200).json({ success: true, msg: "Atividade Apagada com sucesso" })
    }).catch(err => {
      res.status(404).json({ success: false, msg: "Não foi possivel encontrar a Atividade" });
    });
});

router.post("/atividades/:id", (req, res) => {
  let projectId = mongoose.Types.ObjectId(req.params.id);
  let atividade = { descricao: req.body.descricao, dataAcontecimento: req.body.dataAcontecimento };
  console.log(req.body)
  Project.findOneAndUpdate({ _id: projectId }, { $push: { atividades: atividade } }).then(project => {
    res.status(200).json({ success: true, msg: "Atividade adicionada com sucesso" });
  }).catch(err => {
    res.status(404).json({ success: false, msg: err });
  });
});

async function processArray(array) {
  var data = [];
  for (const elem of array) {
    await User.findById(elem["userId"]).then((user) => {
      let aux = {
        id: user._id,
        name: user.nome,
      };
      data.push(aux);
    });
  }
  return data;
}

module.exports = router;
