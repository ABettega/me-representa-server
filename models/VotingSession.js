const mongoose = require('mongoose');

module.exports = new mongoose.model('VotingSession', new mongoose.Schema({
  id: { unique: true, type: String },
  uri: String,
  votes: {
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