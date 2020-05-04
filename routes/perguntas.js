const router = require('express').Router();
const Pergunta = require('../classes/Pergunta');

router.post('/', (req, res) => {
  const { perguntas } = req.body;

  const pergunta = new Pergunta();

  res.status(200).json(pergunta.pegarPerguntaAleatoria());

  // Pergunta.pegarPerguntaAleatoria(perguntas)
  //   .then((perguntasSemResposta) => {
  //     res.status(200).json(perguntasSemResposta);
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     res.status(400).json(e);
  //   });
});

module.exports = router;
