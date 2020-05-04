const PerguntasModel = require('../models/Perguntas');

class Pergunta {
  constructor() {};

  criarNovaPergunta() {
    
  };

  pegarPerguntaAleatoria(listaPerguntasRespondidas) {
    return PerguntasModel.aggregate([{ $match: { votacaoVinculada: { $nin: listaPerguntasRespondidas }}}, { $sample: {size: 1 }}]);
  };
}

module.exports = new Pergunta();
