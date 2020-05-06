const router = require('express').Router();
const Question = require('../classes/Question');

router.post('/', (req, res) => {
  const { questions } = req.body;

  const question = new Question();

  res.status(200).json(question.getRandomQuestion(questions));

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
