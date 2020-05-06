const router = require('express').Router();
const Question = require('../classes/Question');

router.post('/', (req, res) => {
  const { questions } = req.body;

  const question = new Question();

  question.getRandomQuestion(questions)
    .then(randomQuestion => res.status(200).json(randomQuestion))	
    .catch(e => res.status(400).json(e));
});

module.exports = router;
