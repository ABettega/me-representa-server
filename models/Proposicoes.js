const mongoose = require('mongoose');

module.exports = new mongoose.model('Proposicoes', new mongoose.Schema({
  id: { unique: true, type: String },
  siglaTipo: String,
  numero: Number,
  ano: Number,
  ementa: String,
  dataApresentacao: String,
  uriAutores: String,
  urlInteiroTeor: String,
}));
