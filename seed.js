const axios = require('axios');
const mongoose = require('mongoose');
const Deputados = require('./models/Deputados');
const Votacoes = require('./models/Votacoes');

mongoose.connect('mongodb://localhost/me-representa', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

// axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura=56&ordem=ASC&ordenarPor=nome')
//   .then(result => {
//     console.log(result.data.dados.length);
//     const deputados = result.data.dados.map(deputado => {
//       delete deputado.uriPartido;
//       return deputado;
//     });
//     Deputados.create(deputados)
//       .then(() => {
//         console.log('Deputados inseridos com sucesso!');
//         mongoose.connection.close();
//       });
//   })
//   .catch(e => {
//     console.log(e);
//   });

axios.get('https://dadosabertos.camara.leg.br/api/v2/votacoes?dataInicio=2020-01-01&dataFim=2020-04-30&itens=200&ordem=DESC&ordenarPor=dataHoraRegistro&pagina=3')
  .then(result => {
    const votacoes = result.data.dados.map(votacao => {
      delete votacao.data;
      delete votacao.uriOrgao;
      delete votacao.uriEvento;
      return votacao;
    });
    Votacoes.create(votacoes)
      .then(() => {
        console.log('Votações inseridas com sucesso!');
        mongoose.connection.close();
      })
      .catch(e => {
        console.log(e);
      });
  });
