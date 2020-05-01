const Perguntas = require('../models/Perguntas');

const router = require('express').Router();

router.post('/', (req, res) => {
  const { perguntas } = req.body;

  Perguntas.findOne({ _id: { $nin: perguntas }})
    .then((perguntasSemResposta) => {
      res.status(200).json(perguntasSemResposta);
    })
    .catch((e) => {
      console.log(e);
      res.status(400).json(e);
    });
});

module.exports = router;
