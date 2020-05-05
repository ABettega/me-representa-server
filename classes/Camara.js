const Deputados = require('../models/Deputados');
const Votacao = require('../models/Votacao');

class Camara {
  constructor() {};

  match(listaVotos) {
    if (!listaVotos || !Array.isArray(listaVotos)) {
      throw new Error('A função deve receber uma lista de votos como um array!');
    }

    return new Promise((resolve, reject) => {
      const arrVotacoesRespondidas = listaVotos.map(el => el.idVotacao);
      listaVotos.forEach((itemVotado) => {
        if (!itemVotado.idVotacao || !itemVotado.voto) {
          throw new Error('Os objetos precisam ter os parâmetros "idVotacao" (string) e "voto" (string)!');
        }
      });
  
      Votacao.find({ id: { $in: arrVotacoesRespondidas }})
      // Votacao.find({})
        .then((votacoes) => {
          console.log(votacoes);
          resolve(votacoes);
          // votacoes.forEach((votacao) => {

          // });
        });
    });
  }
}

module.exports = Camara;
