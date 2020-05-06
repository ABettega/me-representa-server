const Deputados = require('../models/Deputados');
const Votacao = require('../models/Votacao');

class Camara {
  constructor(topMatchLimite = 10) {
    this.topMatchLimite = topMatchLimite;
  };

  match(listaVotos) {
    if (!listaVotos || !listaVotos.votos || Object.keys(listaVotos.votos).length < 1) {
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
          let matches = this.organizarMatches(deputados, Object.keys(listaVotos).length);
          matches = this.melhoresMatches(matches);
          this.popularDeputados(matches)
            .then((topMatches) => {
              resolve(topMatches);
            });
        })
        .catch(e => reject(e));
    });
  }

  organizarMatches(deputados, votosTotais) {
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

    return listaOrdenada.sort((a, b) => b.match.absoluto - a.match.absoluto);
  }

  melhoresMatches(listaOrganizadaMatches) {
    if (!listaOrganizadaMatches || !Array.isArray(listaOrganizadaMatches)) {
      throw new Error('A função deve receber uma lista de matches como um array!');
    }

    if (listaOrganizadaMatches.length < this.topMatchLimite) {
      throw new Error('A função deve receber uma lista de matches com pelo menos 10 elementos!');
    }

    let counter = 1;
    const arrDeputados = [listaOrganizadaMatches[0]];

    for (let i = 1; i < listaOrganizadaMatches.length - 1; i += 1) {
      if (listaOrganizadaMatches[i].match.absoluto !== listaOrganizadaMatches[i - 1].match.absoluto) {
        if (counter < this.topMatchLimite) {
          counter += 1;
          arrDeputados.push(listaOrganizadaMatches[i]);
        } else {
          break;
        }
      } else {
        arrDeputados.push(listaOrganizadaMatches[i]);
      }
    }

    return arrDeputados;
  }

  popularDeputados(listaDeputados) {
    if (!listaDeputados || !Array.isArray(listaDeputados)) {
      throw new Error('A função deve receber uma lista de ids de deputados como um array!');
    }

    const idsDeputados = listaDeputados.map((deputado) => deputado.id);
    return new Promise((resolve, reject) => {
      Deputados.find({ id: { $in: idsDeputados }})
        .then((infoDeputados) => {
          const retornoPopulado = infoDeputados.map((deputado) => {
            for (let i = 0; i < listaDeputados.length; i += 1) {
              if (parseInt(deputado.id, 10) === parseInt(listaDeputados[i].id, 10)) {
                const temp = listaDeputados.splice(i, 1);
                return {
                  ...deputado._doc,
                  match: temp[0].match,
                  votacoes: temp[0].votacoes,
                };
              }
            }
          });
          resolve(retornoPopulado);
        })
        .catch(e => reject(e));
    });
  }
}

module.exports = Camara;
