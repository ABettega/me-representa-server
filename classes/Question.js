const Questions = require('../models/Questions');
const VotingSession = require('../models/VotingSession');

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

    return new Promise((resolve, reject) => {
      Questions.aggregate([{ $match: { votacaoVinculada: { $nin: answeredQuestionsList }}}, { $sample: {size: 1 }}])
        .then((questionArr) => {
          VotingSession.find({ id: questionArr[0].votacaoVinculada })
            .then((session) => {
              if (!session) {
                reject('Não foi encontrada sessão vinculada!');
              }
              session = session[0];
              if (session.proposicoes.length === 1) {
                questionArr[0].proposicao = session.proposicoes[0];
                resolve(questionArr[0]);
              }
              let prop;
              session.proposicoes.forEach((proposicao) => {
                if (proposicao.siglaTipo === 'RDF') {
                  if (!prop || prop.numero < proposicao.numero) {
                    prop = proposicao;
                  }
                }
              });
              if (!prop) {
                prop = session.proposicoes[0];
              }
              questionArr[0].proposicao = prop;
              resolve(questionArr[0]);
            })
            .catch(e => reject(e));
        })
        .catch(e => reject(e));
    })
  };
}

module.exports = Question;
