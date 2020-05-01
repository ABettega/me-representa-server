const mongoose = require('mongoose');

module.exports = new mongoose.model('Perguntas', new mongoose.Schema({
  descricao: String,
  votacaoVinculada: String,
}));
