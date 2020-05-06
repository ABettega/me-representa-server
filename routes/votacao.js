const router = require('express').Router();
const Camara = require('../classes/Camara');

router.post('/', (req, res) => {
  const { respostas } = req.body;
  const camara = new Camara();

  camara.match(respostas)
    .then(resultado => res.status(200).json(resultado))
    .catch(e => res.status(400).json(e));
});

module.exports = router;
