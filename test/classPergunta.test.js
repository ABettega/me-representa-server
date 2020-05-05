require('dotenv').config({ path: __dirname + '/../.env' });
const Pergunta = require('../classes/Pergunta');
const ModelPergunta = require('../models/Perguntas');
const mongoose = require('mongoose');
const expect = require('expect');

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
    expect(pergunta instanceof Pergunta).toBeTruthy();
  });

  describe('Método criarNovaPergunta', () => {
    it('deve existir', () => {
      expect(typeof pergunta.criarNovaPergunta).toBe('function');
    });

    it('deve receber dois parâmetros', () => {
      expect(
        () => { return pergunta.criarNovaPergunta() }
      ).toThrow(
        'A função deve receber a Descrição como string como primeiro parâmetro!'
      );

      expect(
        () => { return pergunta.criarNovaPergunta({ teste: 'descrição' }) }
      ).toThrow(
        'A função deve receber a Descrição como string como primeiro parâmetro!'
      );

      expect(
        () => { return pergunta.criarNovaPergunta('DescriçãoTeste') }
      ).toThrow(
        'A função deve receber a Votação Vinculada como string como segundo parâmetro!'
      );

      expect(
        () => { return pergunta.criarNovaPergunta('Descrição', { teste: 'descrição' }) }
      ).toThrow(
        'A função deve receber a Votação Vinculada como string como segundo parâmetro!'
      );
    });

    it('deve receber uma Descrição com menos de 400 caracteres', () => {
      expect(
        () => { return pergunta.criarNovaPergunta('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque iaculis blandit orci, ut pulvinar velit egestas rutrum. Ut semper scelerisque eros eu vehicula. Donec gravida vitae massa at accumsan. Maecenas venenatis tempor tortor id pellentesque. Sed mattis metus metus, et dapibus arcu placerat nec. Nullam condimentum ultrices ex. In sagittis eu elit vitae varius. Morbi auctor elit eget nullam!!', 'Votação Vinculada') }
      ).toThrow(
        'A Descrição deve ter no máximo 400 caracteres!'
      );
    });
  
    it('deve salvar a pergunta no banco de dados', (done) => {
      pergunta.criarNovaPergunta('DescriçãoTeste', 'Votação Vinculada')
        .then(() => {
          ModelPergunta.countDocuments()
          .then((countResult) => {
            expect(countResult).toBe(1);
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
      expect(typeof pergunta.pegarPerguntaAleatoria).toBe('function');
    });

    it('deve receber uma lista de perguntas respondidas como parâmetro', () => {
      expect(
        () => { return pergunta.pegarPerguntaAleatoria() }
      ).toThrow(
        'A função deve receber uma lista de perguntas respondidas como array como parâmetro!',
      );
      
      expect(
        () => { return pergunta.pegarPerguntaAleatoria('teste') }
      ).toThrow(
        'A função deve receber uma lista de perguntas respondidas como array como parâmetro!',
      );

      expect(
        () => { return pergunta.pegarPerguntaAleatoria(new Set([1, 2, 3])) }
      ).toThrow(
        'A função deve receber uma lista de perguntas respondidas como array como parâmetro!',
      );
    });

    it('deve retornar uma pergunta', (done) => {
      pergunta.criarNovaPergunta('DescriçãoTeste', 'Votação Vinculada')
        .then(() => {
          pergunta.pegarPerguntaAleatoria([])
          .then((perguntaRetorno) => {
            expect(perguntaRetorno[0].descricao).toBe('DescriçãoTeste');
            expect(perguntaRetorno[0].votacaoVinculada).toBe('Votação Vinculada');
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
          arrPerguntas.forEach(pergunta => {
            objPossibilities[pergunta[0].votacaoVinculada] = pergunta[0].votacaoVinculada;
          });
          const keys = Object.keys(objPossibilities);
          expect(keys.length).toBeGreaterThan(1);
          expect(keys.length).toBeLessThanOrEqual(10);
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
            expect(pergunta[0].votacaoVinculada).toBe('2');
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
