const Congressmen = require('../models/Congressmen');

const router = require('express').Router();

router.post('/', (req, res) => {
  const { dados } = req.body;

  dados.forEach(dado => {
    axios.get(`https://dadosabertos.camara.leg.br/api/v2/votacoes/${dado.pergunta}/votos`)
      .then(() => {

      });
  });
//https://dadosabertos.camara.leg.br/api/v2/votacoes/:id/votos
  Perguntas.aggregate([{ $match: { votacaoVinculada: { $nin: perguntas }}}, { $sample: {size: 1 }}])
    .then((perguntasSemResposta) => {
      res.status(200).json(perguntasSemResposta);
    })
    .catch((e) => {
      console.log(e);
      res.status(400).json(e);
    });
});

module.exports = router;
