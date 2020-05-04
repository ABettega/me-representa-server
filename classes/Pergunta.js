// const PerguntasModel = require('../models/Perguntas');

// class Pergunta {
//   constructor() {};

//   criarNovaPergunta() {
    
//   };

//   pegarPerguntaAleatoria(listaPerguntasRespondidas) {
//     return PerguntasModel.aggregate([{ $match: { votacaoVinculada: { $nin: listaPerguntasRespondidas }}}, { $sample: {size: 1 }}]);
//   };
// }

// module.exports = new Pergunta();

const Perguntas = require('../models/Perguntas');

class Pergunta {
  constructor() {};

  criarNovaPergunta(descricao, votacaoVinculada) {
    return Perguntas.create({ descricao, votacaoVinculada });
  };
 
  pegarPerguntaAleatoria(listaPerguntasRespondidas) {
    return Perguntas.aggregate([{ $match: { votacaoVinculada: { $nin: listaPerguntasRespondidas }}}, { $sample: {size: 1 }}]);
  };
}

module.exports = Pergunta;
