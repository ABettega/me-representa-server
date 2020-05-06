const router = require('express').Router();
const Congress = require('../classes/Congress');

router.post('/', (req, res) => {
  const { answers } = req.body;
  const congress = new Congress();

  congress.match(answers)
    .then(result => res.status(200).json(result))
    .catch(e => res.status(400).json(e));
});

module.exports = router;
