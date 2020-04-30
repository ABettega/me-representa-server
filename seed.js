const axios = require('axios');
const mongoose = require('mongoose');
const Deputados = require('./models/Deputados');

mongoose.connect('mongodb://localhost/me-representa', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura=56&ordem=ASC&ordenarPor=nome')
  .then(result => {
    console.log(result.data.dados.length);
    const deputados = result.data.dados.map(deputado => {
      delete deputado.uriPartido;
      return deputado;
    });
    Deputados.create(deputados)
      .then(() => {
        console.log('Deputados inseridos com sucesso!');
        mongoose.connection.close();
      });
  })
  .catch(e => {
    console.log(e);
  });
