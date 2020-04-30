const mongoose = require('mongoose');

module.exports = new mongoose.model('Votacoes', new mongoose.Schema({
  id: { unique: true, type: String },
  uri: String,
  dataHoraRegistro: Date,
  siglaOrgao: String,
  proposicaoObjeto: String,
  uriProposicaoObjeto: String,
  descricao: String,
  aprovacao: Number,
}));
