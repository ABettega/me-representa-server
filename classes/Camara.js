const Deputados = require('../models/Deputados');
const Votacao = require('../models/Votacao');

class Camara {
  constructor() {};

  match(listaVotos) {
    if (!listaVotos || !listaVotos.votos) {
      throw new Error('A função deve receber uma lista de votos como um objeto contendo a propriedade votos!');
    }

    return new Promise((resolve, reject) => {
      Votacao.find({ id: { $in: Object.keys(listaVotos.votos) }})
        .then((votacoes) => {
          const deputados = {};
          votacoes.forEach((votacao) => {
            for (const key in votacao.votos) {
              if (!deputados[key]) {
                deputados[key] = {
                  presente: 0,
                  votoIgual: 0,
                }
              }
              deputados[key].presente += 1;
              if (votacao.votos[key] === listaVotos.votos[votacao.id]) {
                deputados[key].votoIgual += 1;
              }
            }
          });
          resolve(this.melhoresMatches(deputados, Object.keys(listaVotos).length));
        })
        .catch(e => reject(e));
    });
  }

  melhoresMatches(deputados, votosTotais) {
    let listaDeputados;
    if (!deputados || typeof deputados !== 'object') {
      throw new Error('A função deve receber uma lista de deputados como um objeto ou um array!');
    }

    if (!votosTotais || typeof votosTotais !== 'number') {
      throw new Error ('O segundo parâmetro deve ser o número total de votações do usuário (Number)!');
    }

    if (!deputados.length) {
      listaDeputados = [];
      for (const key in deputados) {
        listaDeputados.push({ ...deputados[key], id: key });
      }
    } else {
      listaDeputados = [...deputados];
    }

    const listaOrdenada = [];

    listaDeputados.forEach((deputado) => {
      if (!(deputado.presente !== undefined && deputado.votoIgual !== undefined)) {
        throw new Error('Os objetos na lista de deputados devem ter as propriedades "presente" (Number) e "votoIgual" (Number)!');
      }

      listaOrdenada.push({
        id: deputado.id,
        match: {
          relativo: (deputado.votoIgual / deputado.presente) * 100,
          absoluto: (deputado.votoIgual / votosTotais) * 100,
        },
        votacoes: {
          presente: deputado.presente,
          votoIgual: deputado.votoIgual,
        },
      });
    });

    return listaOrdenada.sort((a, b) => b.match.absoluto > a.match.absoluto);
  }
}

module.exports = Camara;
