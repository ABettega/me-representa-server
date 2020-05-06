const mongoose = require('mongoose');

module.exports = new mongoose.model('Congressmen', new mongoose.Schema({
  id: { unique: true, type: Number },
  nome: String,
  siglaPartido: String,
  siglaUf: String,
  idLegislatura: Number,
  urlFoto: String,
  email: String,
  uri: String,
}));
