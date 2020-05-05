const Perguntas = require('../models/Perguntas');

class Pergunta {
  constructor() {};

  criarNovaPergunta(descricao, votacaoVinculada) {
    if (!descricao || typeof descricao !== 'string') {
      throw new Error('A função deve receber a Descrição como string como primeiro parâmetro!');
    }
    
    if (descricao.length > 400) {
      throw new Error('A Descrição deve ter no máximo 400 caracteres!');
    }
    
    if (!votacaoVinculada || typeof votacaoVinculada !== 'string') {
      throw new Error('A função deve receber a Votação Vinculada como string como segundo parâmetro!');
    }

    return Perguntas.create({ descricao, votacaoVinculada });
  };
 
  pegarPerguntaAleatoria(listaPerguntasRespondidas) {
    if (!listaPerguntasRespondidas || !Array.isArray(listaPerguntasRespondidas)) {
      throw new Error('A função deve receber uma lista de perguntas respondidas como array como parâmetro!');
    }

    return Perguntas.aggregate([{ $match: { votacaoVinculada: { $nin: listaPerguntasRespondidas }}}, { $sample: {size: 1 }}]);
  };
}

module.exports = Pergunta;
