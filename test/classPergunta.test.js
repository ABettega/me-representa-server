require('dotenv').config({ path: __dirname + '/../.env' });
const Pergunta = require('../classes/Pergunta');
const ModelPergunta = require('../models/Perguntas');
const mongoose = require('mongoose');
const assert = require('assert');

let pergunta;

before((done) => {
  mongoose.connect(process.env.MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      done();
    });
});

beforeEach(() => {
  pergunta = new Pergunta();
});

describe('Classe Pergunta', () => {
  it('deve poder ser instanciada', () => {
    assert.strictEqual(pergunta instanceof Pergunta, true);
  });

  describe('Método criarNovaPergunta', () => {
    it('deve existir', () => {
      assert.strictEqual(typeof pergunta.criarNovaPergunta, 'function');
    });
  
    it('deve salvar a pergunta no banco de dados', (done) => {
      pergunta.criarNovaPergunta('DescriçãoTeste', 'Votação Vinculada')
        .then(() => {
          ModelPergunta.countDocuments()
          .then((countResult) => {
            assert.strictEqual(countResult, 1);
            done();
          })
          .catch((e) => {
            done(e);
          });
        });
    });
  });

  describe('Método pegarPerguntaAleatoria', () => {
    it('deve existir', () => {
      assert.strictEqual(typeof pergunta.pegarPerguntaAleatoria, 'function');
    });

    it('deve retornar uma pergunta', (done) => {
      pergunta.criarNovaPergunta('DescriçãoTeste', 'Votação Vinculada')
        .then(() => {
          pergunta.pegarPerguntaAleatoria([])
          .then((perguntaRetorno) => {
            assert.strictEqual(perguntaRetorno[0].descricao, 'DescriçãoTeste');
            assert.strictEqual(perguntaRetorno[0].votacaoVinculada, 'Votação Vinculada');
            done();
          })
          .catch(e => {
            done(e);
          });
        });
    });

    it('deve retornar uma pergunta aleatória', (done) => {
      Promise.all([
        pergunta.criarNovaPergunta('DescriçãoTeste', '1'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '2'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '3'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '4'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '5'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '6'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '7'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '8'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '9'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '10'),
      ])
      .then(() => {
        Promise.all([
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
          pergunta.pegarPerguntaAleatoria([]),
        ])
        .then((arrPerguntas) => {
          const objPossibilities = {};
          let flag = false;
          arrPerguntas.forEach(pergunta => {
            objPossibilities[pergunta[0].votacaoVinculada] = pergunta[0].votacaoVinculada;
          });
          const keys = Object.keys(objPossibilities);
          assert(keys.length > 1);
          assert(keys.length <= 10);
          done();
        })
        .catch((e) => {
          done(e);
        });
      })
      .catch((e) => {
        done(e);
      });
    });

    it('deve retornar uma pergunta não respondida', (done) => {
      Promise.all([
        pergunta.criarNovaPergunta('DescriçãoTeste', '1'),
        pergunta.criarNovaPergunta('DescriçãoTeste', '2'),
      ])
      .then((perguntasCriadas) => {
        pergunta.pegarPerguntaAleatoria([perguntasCriadas[0]._id])
          .then((pergunta) => {
            assert.strictEqual(pergunta[0].votacaoVinculada, '2');
            done();
          })
          .catch((e) => {
            done(e);
          })
      })
      .catch((e) => {
        done(e);
      });
    });
  });
})

afterEach((done) => {
  ModelPergunta.deleteMany({ descricao: 'DescriçãoTeste' })
    .then(() => {
      done();
    });
});

after(() => {
  mongoose.connection.close();
});
