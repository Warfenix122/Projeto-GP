const Project = require('../models/mongoConnection').Projeto;
const Categoria = require('../models/mongoConnection').CategoriaProjeto;
const PublicoAlvo = require('../models/mongoConnection').PublicoAlvo;
const express = require('express');
const router = express.Router();

router.post('/createProject', (req, res) => {
	const {
		nome,
		responsavelId,
		resumo,
		publicoAlvo,
		descricaoAtividades,
		formacoesNecessarias,
		dataAcontecimento,
		dataTermino,
		dataComeco,
		dataFechoInscricoes,
		nrVagas,
		gestoresIds,

		XemXTempo,
		areasInteresse
	} = req.body;

	PublicoAlvo.find({ descricao: publicoAlvo }).then((publicoAlvo) => {
		if (publicoAlvo) {
			existingPublicoAlvo = publicoAlvo;
		} else {
			const newPublicoAlvo = new PublicoAlvo({
				descricao: publicoAlvo,
				predefinido: false
			});
			newPublicoAlvo.save().then((publicoAlvo) => {
				publicoAlvo = publicoAlvo.id;
			});
		}
	});

	Project.findOne({ nome: nome }).then((project) => {
		if (project) {
			res.status(409).send('Já existe um projeto com esse nome');
		} else {
			const newProject = new Project({
				nome: nome,
				resumo: resumo,
				responsavelId: responsavelId,
				formacoesNecessarias: formacoesNecessarias,
				XemXTempo: XemXTempo,
				aprovado: 'Em espera',
				gestores: gestoresIds,
				atividades: [
					{
						descricao: descricaoAtividades,
						dataAcontecimento: dataAcontecimento
					}
				],
				vagas: nrVagas,
				projetoMes: false,
				dataCriacao: Date.now(),
				dataTermino: dataTermino,
				dataFechoInscricoes: dataFechoInscricoes,
				dataComeco: dataComeco,
				areasInteresse: areasInteresse
			});
		}
	});
});

module.exports = router;
