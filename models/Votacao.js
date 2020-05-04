const mongoose = require('mongoose');

module.exports = new mongoose.model('Votacoes', new mongoose.Schema({
  id: { unique: true, type: String },
  uri: String,
  votos: {
  },
  proposicoes: [{
    id: Number,
    uri: String,
    ementa: String,
    codTipo: Number,
    siglaTipo: String,
    numero: Number,
    titulo: String,
    urlInteiroTeor: String,
  }],
}));