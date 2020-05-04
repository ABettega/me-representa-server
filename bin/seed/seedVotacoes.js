const mongoose = require('mongoose');
let votos = require('../seedFiles/votacoesVotos-2020.json');
let objetosVotacoes = require('../seedFiles/votacoesObjetos-2020.json');
let proposicoes = require('../seedFiles/proposicoes-2020.json');

const Votacao = require('../../models/Votacao');

// Remove votos simbólicos
votos = votos.dados.filter(el => {
  if (el.voto !== 'Simbólico') {
    return true;
  }
  
  return false;
});

// Pega o link para o documento em inteiro teor de cada proposição
// e organiza num objeto para uso fácil
const urlInteiroTeor = {};
proposicoes.dados.forEach(el => {
  urlInteiroTeor[el.id] = el.urlInteiroTeor;
});

const reject = {
  'EMP': true,
  'REQ': true,
};
const accept = {
  'RDF': true,
  'MIP': true,
  'PPP': true,
}
const objetos = {};

// Remove objetos que não são relevantes
objetosVotacoes.dados.forEach(el => {
  // if (!reject[el.proposicao_.siglaTipo]) {
  if (accept[el.proposicao_.siglaTipo]) {
    if (!objetos[el.idVotacao]) {
      objetos[el.idVotacao] = [];
      // objetos[el.idVotacao] = {};
    }
  
    objetos[el.idVotacao].push({
      ...el.proposicao_,
      urlInteiroTeor: urlInteiroTeor[el.proposicao_.id],
    });
    // objetos[el.idVotacao] = {
    //   ...el.proposicao_,
    //   urlInteiroTeor: urlInteiroTeor[el.proposicao_.id],
    // };
  }
});

const votacoes = {};

// Mantém apenas votações que tenham objeto
votos.forEach(el => {
  if (!votacoes[el.idVotacao] && objetos[el.idVotacao]) {
    votacoes[el.idVotacao] = {
      id: el.idVotacao,
      uri: el.uriVotacao,
      votos: {},
      proposicoes: objetos[el.idVotacao],
    };
  }

  if (objetos[el.idVotacao]) {
    // votacoes[el.idVotacao].votos[el.deputado_.id] = {
    //     voto: el.voto,
    //     dataHoraVoto: el.dataHoraVoto,
    // };
    votacoes[el.idVotacao].votos[el.deputado_.id] = el.voto;
  }
});

const documents = [];
for (let key in votacoes) {
  documents.push(votacoes[key]);
}

// Salva votações no banco de dados
mongoose.connect('mongodb://localhost/me-representa', { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {
  const connection = result.connections[0];
  console.log('----- MongoDB Connected -----');
  console.log('Host:', connection.host);
  console.log('Database name:', connection.name);
  console.log('Port:', connection.port);
  console.log('-----------------------------');
  console.log('----- Initializing Seed -----');
  console.log('-----------------------------');

  Votacao.create(documents)
    .then(() => {
      console.log('Votações inseridas com sucesso!');
      console.log('-----------------------------');
      mongoose.connection.close();
    })
    .catch(e => {
      console.log(e);
      console.log('-----------------------------');
      mongoose.connection.close();
    });
})
.catch(e => console.log(e));