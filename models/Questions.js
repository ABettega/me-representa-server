const mongoose = require('mongoose');

module.exports = new mongoose.model('Questions', new mongoose.Schema({
  descricao: String,
  votacaoVinculada: String,
}));
