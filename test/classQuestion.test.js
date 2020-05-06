require('dotenv').config({ path: __dirname + '/../.env' });
const Question = require('../classes/Question');
const ModelQuestion = require('../models/Questions');
const mongoose = require('mongoose');
const expect = require('expect');

let question;

before((done) => {
  mongoose.connect(process.env.TEST_MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      done();
    });
});

beforeEach(() => {
  question = new Question();
});

describe('Classe Question', () => {
  it('deve poder ser instanciada', () => {
    expect(question instanceof Question).toBeTruthy();
  });

  describe('Método createNewQuestion', () => {
    it('deve existir', () => {
      expect(typeof question.createNewQuestion).toBe('function');
    });

    it('deve receber dois parâmetros', () => {
      expect(
        () => { return question.createNewQuestion() }
      ).toThrow(
        'A função deve receber a Descrição como string como primeiro parâmetro!'
      );

      expect(
        () => { return question.createNewQuestion({ teste: 'descrição' }) }
      ).toThrow(
        'A função deve receber a Descrição como string como primeiro parâmetro!'
      );

      expect(
        () => { return question.createNewQuestion('DescriçãoTeste') }
      ).toThrow(
        'A função deve receber a Votação Vinculada como string como segundo parâmetro!'
      );

      expect(
        () => { return question.createNewQuestion('Descrição', { teste: 'descrição' }) }
      ).toThrow(
        'A função deve receber a Votação Vinculada como string como segundo parâmetro!'
      );
    });

    it('deve receber uma Descrição com menos de 400 caracteres', () => {
      expect(
        () => { return question.createNewQuestion('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque iaculis blandit orci, ut pulvinar velit egestas rutrum. Ut semper scelerisque eros eu vehicula. Donec gravida vitae massa at accumsan. Maecenas venenatis tempor tortor id pellentesque. Sed mattis metus metus, et dapibus arcu placerat nec. Nullam condimentum ultrices ex. In sagittis eu elit vitae varius. Morbi auctor elit eget nullam!!', 'Votação Vinculada') }
      ).toThrow(
        'A Descrição deve ter no máximo 400 caracteres!'
      );
    });
  
    it('deve salvar a pergunta no banco de dados', (done) => {
      question.createNewQuestion('DescriçãoTeste', 'Votação Vinculada')
        .then(() => {
          ModelQuestion.countDocuments()
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

  describe('Método getRandomQuestion', () => {
    it('deve existir', () => {
      expect(typeof question.getRandomQuestion).toBe('function');
    });

    it('deve receber uma lista de perguntas respondidas como parâmetro', () => {
      expect(
        () => { return question.getRandomQuestion() }
      ).toThrow(
        'A função deve receber uma lista de perguntas respondidas como array como parâmetro!',
      );
      
      expect(
        () => { return question.getRandomQuestion('teste') }
      ).toThrow(
        'A função deve receber uma lista de perguntas respondidas como array como parâmetro!',
      );

      expect(
        () => { return question.getRandomQuestion(new Set([1, 2, 3])) }
      ).toThrow(
        'A função deve receber uma lista de perguntas respondidas como array como parâmetro!',
      );
    });

    it('deve retornar uma pergunta', (done) => {
      question.createNewQuestion('DescriçãoTeste', 'Votação Vinculada')
        .then(() => {
          question.getRandomQuestion([])
          .then((returnedQuestion) => {
            expect(returnedQuestion[0].descricao).toBe('DescriçãoTeste');
            expect(returnedQuestion[0].votacaoVinculada).toBe('Votação Vinculada');
            done();
          })
          .catch(e => {
            done(e);
          });
        });
    });

    it('deve retornar uma pergunta aleatória', (done) => {
      Promise.all([
        question.createNewQuestion('DescriçãoTeste', '1'),
        question.createNewQuestion('DescriçãoTeste', '2'),
        question.createNewQuestion('DescriçãoTeste', '3'),
        question.createNewQuestion('DescriçãoTeste', '4'),
        question.createNewQuestion('DescriçãoTeste', '5'),
        question.createNewQuestion('DescriçãoTeste', '6'),
        question.createNewQuestion('DescriçãoTeste', '7'),
        question.createNewQuestion('DescriçãoTeste', '8'),
        question.createNewQuestion('DescriçãoTeste', '9'),
        question.createNewQuestion('DescriçãoTeste', '10'),
      ])
      .then(() => {
        Promise.all([
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
          question.getRandomQuestion([]),
        ])
        .then((questionsArr) => {
          const objPossibilities = {};
          questionsArr.forEach(question => {
            objPossibilities[question[0].votacaoVinculada] = question[0].votacaoVinculada;
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
        question.createNewQuestion('DescriçãoTeste', '1'),
        question.createNewQuestion('DescriçãoTeste', '2'),
      ])
      .then((createdQuestions) => {
        question.getRandomQuestion([createdQuestions[0].votacaoVinculada])
          .then((question) => {
            expect(question[0].votacaoVinculada).toBe('2');
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
  ModelQuestion.deleteMany({})
    .then(() => {
      done();
    });
});

after(() => {
  mongoose.connection.close();
});
