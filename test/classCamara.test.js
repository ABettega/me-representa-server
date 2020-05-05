require('dotenv').config({ path: __dirname + '/../.env' });
const Camara = require('../classes/Camara');
// const ModelPergunta = require('../models/Perguntas');
const mongoose = require('mongoose');
const assert = require('assert');

let camara;

before((done) => {
  mongoose.connect(process.env.TEST_MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      done();
    });
});

beforeEach(() => {
  camara = new Camara();
});

describe('Classe Camara', () => {
  it('deve poder ser instanciada', () => {
    assert.strictEqual(camara instanceof Camara, true);
  });

  describe('Método match', () => {
    it('deve existir', () => {
      assert.strictEqual(typeof camara.match, 'function');
    });
  });
})

// afterEach((done) => {
// });

after(() => {
  mongoose.connection.close();
});
