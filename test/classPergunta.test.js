require('dotenv').config({ path: __dirname + '/../.env' });
const Pergunta = require('../classes/Pergunta');
const ModelPergunta = require('../models/Perguntas');
const mongoose = require('mongoose');
const assert = require('assert');

let pergunta;

before((done) => {
  mongoose.connect(process.env.TEST_MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
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

    it('deve receber dois parâmetros', () => {
      assert.throws(
        () => { return pergunta.criarNovaPergunta() },
        Error,
        'A função deve receber a Descrição como string como primeiro parâmetro!'
      );

      assert.throws(
        () => { return pergunta.criarNovaPergunta({ teste: 'descrição' }) },
        Error,
        'A função deve receber a Descrição como string como primeiro parâmetro!'
      );

      assert.throws(
        () => { return pergunta.criarNovaPergunta('DescriçãoTeste') },
        Error,
        'A função deve receber a Votação Vinculada como string como segundo parâmetro!'
      );

      assert.throws(
        () => { return pergunta.criarNovaPergunta('Descrição', { teste: 'descrição' }) },
        Error,
        'A função deve receber a Votação Vinculada como string como segundo parâmetro!'
      );
    });

    it('deve receber uma Descrição com menos de 400 caracteres', () => {
      assert.throws(
        () => { return pergunta.criarNovaPergunta('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque iaculis blandit orci, ut pulvinar velit egestas rutrum. Ut semper scelerisque eros eu vehicula. Donec gravida vitae massa at accumsan. Maecenas venenatis tempor tortor id pellentesque. Sed mattis metus metus, et dapibus arcu placerat nec. Nullam condimentum ultrices ex. In sagittis eu elit vitae varius. Morbi auctor elit eget nullam!!', 'Votação Vinculada') },
        Error,
        'A Descrição deve ter no máximo 400 caracteres!'
      );
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

    it('deve receber uma lista de perguntas respondidas como parâmetro', () => {
      assert.throws(
        () => { return pergunta.pegarPerguntaAleatoria() },
        Error,
        'A função deve receber uma lista de perguntas respondidas como array como parâmetro!',
      )
      
      assert.throws(
        () => { return pergunta.pegarPerguntaAleatoria('teste') },
        Error,
        'A função deve receber uma lista de perguntas respondidas como array como parâmetro!',
      )

      assert.throws(
        () => { return pergunta.pegarPerguntaAleatoria(new Set([1, 2, 3])) },
        Error,
        'A função deve receber uma lista de perguntas respondidas como array como parâmetro!',
      )
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
        pergunta.pegarPerguntaAleatoria([perguntasCriadas[0].votacaoVinculada])
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
  ModelPergunta.deleteMany({})
    .then(() => {
      done();
    });
});

after(() => {
  mongoose.connection.close();
});
