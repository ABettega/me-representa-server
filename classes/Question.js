const Questions = require('../models/Questions');

class Question {
  constructor() {};

  createNewQuestion(description, linkedVoting) {
    if (!description || typeof description !== 'string') {
      throw new Error('A função deve receber a Descrição como string como primeiro parâmetro!');
    }
    
    if (description.length > 400) {
      throw new Error('A Descrição deve ter no máximo 400 caracteres!');
    }
    
    if (!linkedVoting || typeof linkedVoting !== 'string') {
      throw new Error('A função deve receber a Votação Vinculada como string como segundo parâmetro!');
    }

    return Questions.create({ descricao: description, votacaoVinculada: linkedVoting });
  };
 
  getRandomQuestion(answeredQuestionsList) {
    if (!answeredQuestionsList || !Array.isArray(answeredQuestionsList)) {
      throw new Error('A função deve receber uma lista de perguntas respondidas como array como parâmetro!');
    }

    return Questions.aggregate([{ $match: { votacaoVinculada: { $nin: answeredQuestionsList }}}, { $sample: {size: 1 }}]);
  };
}

module.exports = Question;
