require('dotenv').config({ path: __dirname + '/../.env' });
const Camara = require('../classes/Camara');
const ModelDeputados = require('../models/Deputados');
// const ModelPergunta = require('../models/Perguntas');
const mongoose = require('mongoose');
const assert = require('assert');

let camara;

before((done) => {
  mongoose.connect(process.env.TEST_MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

      for(let i = 0; i < 10; i += 1) {
        ModelDeputados.create({
          id: i,
          nome: `nome ${i}`,
          siglaPartido: `siglaPartido ${i}`,
          siglaUf: `siglaUf ${i}`,
          idLegislatura: 56,
          urlFoto: `urlFoto ${i}`,
          email: `email ${i}`,
          uri: `uri ${i}`,
        });
      }
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

    it('deve receber como parâmetro um array de objetos', () => {
      assert.throws(
        () => { return camara.match() },
        Error,
        'A função deve receber uma lista de votos como um array!',
      );

      assert.throws(
        () => { return camara.match('teste') },
        Error,
        'A função deve receber uma lista de votos como um array!',
      );
    });

    it('deve receber uma lista de objetos com duas propriedades (idVotacao, voto)', () => {
      assert.throws(
        () => { return camara.match([{ idVotacao: '123' }]) },
        Error,
        'Os objetos precisam ter os parâmetros "idVotacao" (string) e "voto" (string)!',
      );

      assert.throws(
        () => { return camara.match([{ voto: '123' }]) },
        Error,
        'Os objetos precisam ter os parâmetros "idVotacao" (string) e "voto" (string)!',
      );

      assert.throws(
        () => { return camara.match([{ idVotacao: '123', voto: '123' }, 1]) },
        Error,
        'Os objetos precisam ter os parâmetros "idVotacao" (string) e "voto" (string)!',
      );
    });

    it('deve retornar uma lista de pelo menos 10 deputados', (done) => {
      camara.match([])
        .then((deputados) => {
          assert(deputados.length >= 10);
          deputados.forEach(deputado => {
            assert.ok(deputado.id);
            assert.ok(deputado.nome);
            assert.ok(deputado.siglaPartido);
            assert.ok(deputado.siglaUf);
            assert.ok(deputado.idLegislatura);
            assert.ok(deputado.urlFoto);
            assert.ok(deputado.email);
            assert.ok(deputado.uri);
            assert.ok(deputado.match);
          });
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
    // Lista em ordem, lista com porcentagem
  });
})

// afterEach((done) => {
// });

after(() => {
  mongoose.connection.db.dropDatabase()
    .then(() => {
      mongoose.connection.close();
    });
});
