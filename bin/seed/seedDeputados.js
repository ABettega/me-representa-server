require('dotenv').config({ path: __dirname + '/../../.env' });
const axios = require('axios');
const mongoose = require('mongoose');
const Congressmen = require('../../models/Congressmen');

mongoose.connect(process.env.MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura=56&ordem=ASC&ordenarPor=nome')
  .then(result => {
    console.log(result.data.dados.length);
    const congressmen = result.data.dados.map(congressman => {
      delete congressman.uriPartido;
      return congressman;
    });
    Congressmen.create(congressmen)
      .then(() => {
        console.log('Deputados inseridos com sucesso!');
        mongoose.connection.close();
      });
  })
  .catch(e => {
    console.log(e);
  });
