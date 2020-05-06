require('dotenv').config({ path: __dirname + '/../.env' });
const Congress = require('../classes/Congress');
const ModelCongressmen = require('../models/Congressmen');
const ModelVotingSession = require('../models/VotingSession');
const mongoose = require('mongoose');
const expect = require('expect');

let congress;

before((done) => {
  mongoose.connect(process.env.TEST_MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      ModelCongressmen.create([
        {
          id: '1', nome: 'nome 1', siglaPartido: 'siglaPartido 1',
          siglaUf: 'siglaUf 1', idLegislatura: 56, urlFoto: 'urlFoto 1',
          email: 'email 1', uri: 'uri 1',
        },
        {
          id: '2', nome: 'nome 2', siglaPartido: 'siglaPartido 2',
          siglaUf: 'siglaUf 2', idLegislatura: 56, urlFoto: 'urlFoto 2',
          email: 'email 2', uri: 'uri 2',
        },
        {
          id: '3', nome: 'nome 3', siglaPartido: 'siglaPartido 3',
          siglaUf: 'siglaUf 3', idLegislatura: 56, urlFoto: 'urlFoto 3',
          email: 'email 3', uri: 'uri 3',
        },
        {
          id: '4', nome: 'nome 4', siglaPartido: 'siglaPartido 4',
          siglaUf: 'siglaUf 4', idLegislatura: 56, urlFoto: 'urlFoto 4',
          email: 'email 4', uri: 'uri 4',
        },
        {
          id: '5', nome: 'nome 5', siglaPartido: 'siglaPartido 5',
          siglaUf: 'siglaUf 5', idLegislatura: 56, urlFoto: 'urlFoto 5',
          email: 'email 5', uri: 'uri 5',
        },
        {
          id: '6', nome: 'nome 6', siglaPartido: 'siglaPartido 6',
          siglaUf: 'siglaUf 6', idLegislatura: 56, urlFoto: 'urlFoto 6',
          email: 'email 6', uri: 'uri 6',
        },
        {
          id: '7', nome: 'nome 7', siglaPartido: 'siglaPartido 7',
          siglaUf: 'siglaUf 7', idLegislatura: 56, urlFoto: 'urlFoto 7',
          email: 'email 7', uri: 'uri 7',
        },
        {
          id: '8', nome: 'nome 8', siglaPartido: 'siglaPartido 8',
          siglaUf: 'siglaUf 8', idLegislatura: 56, urlFoto: 'urlFoto 8',
          email: 'email 8', uri: 'uri 8',
        },
        {
          id: '9', nome: 'nome 9', siglaPartido: 'siglaPartido 9',
          siglaUf: 'siglaUf 9', idLegislatura: 56, urlFoto: 'urlFoto 9',
          email: 'email 9', uri: 'uri 9',
        },
        {
          id: '10', nome: 'nome 10', siglaPartido: 'siglaPartido 10',
          siglaUf: 'siglaUf 10', idLegislatura: 56, urlFoto: 'urlFoto 10',
          email: 'email 10', uri: 'uri 10',
        },
        {
          id: '11', nome: 'nome 11', siglaPartido: 'siglaPartido 11',
          siglaUf: 'siglaUf 11', idLegislatura: 56, urlFoto: 'urlFoto 11',
          email: 'email 11', uri: 'uri 11',
        },
      ])
      .then(() => {
        ModelVotingSession.create([
          {
            id: '1',
            votes: {
              '1': 'Sim', '2': 'Não', '3': 'Sim',
              '4': 'Sim', '5': 'Não', '6': 'Sim',
              '7': 'Sim', '8': 'Não', '9': 'Sim',
              '10': 'Sim', '11': 'Sim',
            }
          },
          {
            id: '2',
            votes: {
              '1': 'Não', '2': 'Sim', '3': 'Não',
              '4': 'Não', '5': 'Sim', '6': 'Sim',
              '7': 'Sim', '8': 'Sim', '9': 'Sim',
              '10': 'Não', '11': 'Sim',
            }
          },
          {
            id: '3',
            votes: {
              '1': 'Abstenção', '2': 'Sim', '3': 'Abstenção',
              '4': 'Abstenção', '5': 'Sim', '6': 'Obstrução',
              '7': 'Obstrução', '8': 'Abstenção', '9': 'Sim',
              '10': 'Não', '11': 'Sim',
            }
          },
        ])
        .then(() => {
          done();
        })
        .catch(e => done(e));
      })
      .catch(e => done(e));
  })
  .catch(e => done(e));
});

beforeEach(() => {
  congress = new Congress();
});

describe('Classe Congress', () => {
  it('deve poder ser instanciada', () => {
    expect(congress instanceof Congress).toBeTruthy();
  });

  it('pode receber o limite de matches como parâmetro', () => {
    congress = new Congress(15);
    expect(congress.topMatchLimit).toBe(15);
  });

  describe('Método match', () => {
    it('deve existir', () => {
      expect(typeof congress.match).toBe('function');
    });

    it('deve receber como parâmetro um objeto com a propriedade votes', () => {
      expect(
        () => { return congress.match() }
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votes!',
      );

      expect(
        () => { return congress.match('teste') }
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votes!',
      );

      expect(
        () => { return congress.match(['teste']) }
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votes!',
      );
      
      expect(
        () => { return congress.match({ votoErro: 'Teste' }) }
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votes!',
      );
    });

    it('deve ter pelo menos uma votação realizada na propriedade votes', () => {
      expect(
        () => congress.match({ votes: {} })
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votes!'
      );
    });

    it('deve retornar uma lista de pelo menos 10 deputados', (done) => {
      congress.match({ votes: {
        '1': 'Sim',
        // '2': 'Não',
        // '3': 'Sim',
      } })
        .then((congressmen) => {
          expect(congressmen.length).toBeGreaterThanOrEqual(10);
          congressmen.forEach(congressman => {
            expect(congressman.id).toBeTruthy();
            expect(congressman.nome).toBeTruthy();
            expect(congressman.siglaUf).toBeTruthy();
            expect(congressman.siglaPartido).toBeTruthy();
            expect(congressman.idLegislatura).toBeTruthy();
            expect(congressman.urlFoto).toBeTruthy();
            expect(congressman.email).toBeTruthy();
            expect(congressman.uri).toBeTruthy();
            expect(congressman.match).toBeTruthy();
            expect(congressman.votingSession).toBeTruthy();
          });
          done();
        })
        .catch((e) => {
          console.log(e);
          done(e);
        });
    });
  });
  
  describe('Método sortMatches', () => {
    it('deve existir', () => {
      expect(typeof congress.sortMatches).toBe('function');
    });

    it('deve receber como primeiro parâmetro um objeto ou um array', () => {
      expect(
        () => { return congress.sortMatches() }
      ).toThrow(
        'A função deve receber uma lista de deputados como um objeto ou um array!',
      );
  
      expect(
        () => { return congress.sortMatches('teste', 1) }
      ).toThrow(
        'A função deve receber uma lista de deputados como um objeto ou um array!',
      );
  
      expect(
        () => { return congress.sortMatches(['teste', 'teste2', 'teste3'], 1) }
      ).toThrow(
        'Os objetos na lista de deputados devem ter as propriedades "present" (Number) e "sameVote" (Number)!',
      );

      expect(
        () => { return congress.sortMatches({ '2': { pasfdresente: 2, sameVote: 2 }, '1': { present: 1, sameVote: 1 }}, 1) }
      ).toThrow(
        'Os objetos na lista de deputados devem ter as propriedades "present" (Number) e "sameVote" (Number)!',
      );
    });

    it('deve receber como segundo parâmetro o número total de votações do usuário', () => {
      expect(
        () => { return congress.sortMatches({ '2': { present: 2, sameVote: 2 }, '1': { present: 1, sameVote: 1 }}) }
      ).toThrow(
        'O segundo parâmetro deve ser o número total de votações do usuário (Number)!'
      );

      expect(
        () => { return congress.sortMatches({ '2': { present: 2, sameVote: 2 }, '1': { present: 1, sameVote: 1 }}, 'asdf') }
      ).toThrow(
        'O segundo parâmetro deve ser o número total de votações do usuário (Number)!'
      );
    });

    it('deve retornar a lista organizada', () => {
      expect(
        congress.sortMatches(
          {
            '2': { present: 10, sameVote: 9 },
            '1': { present: 10, sameVote: 10 },
            '3': { present: 10, sameVote: 8 },
            '5': { present: 10, sameVote: 6 },
            '10': { present: 10, sameVote: 1 },
            '8': { present: 10, sameVote: 3 },
            '7': { present: 10, sameVote: 4 },
            '6': { present: 10, sameVote: 5 },
            '4': { present: 10, sameVote: 7 },
            '9': { present: 10, sameVote: 2 },
            '11': { present: 10, sameVote: 0 },
          },
          10
        )
      ).toEqual(
        [
          {
            id: '1',
            match: { relative: 100, absolute: 100 },
            votingSession: { present: 10, sameVote: 10 },
          },
          {
            id: '2',
            match: { relative: 90, absolute: 90 },
            votingSession: { present: 10, sameVote: 9 },
          },
          {
            id: '3',
            match: { relative: 80, absolute: 80 },
            votingSession: { present: 10, sameVote: 8 },
          },
          {
            id: '4',
            match: { relative: 70, absolute: 70 },
            votingSession: { present: 10, sameVote: 7 },
          },
          {
            id: '5',
            match: { relative: 60, absolute: 60 },
            votingSession: { present: 10, sameVote: 6 },
          },
          {
            id: '6',
            match: { relative: 50, absolute: 50 },
            votingSession: { present: 10, sameVote: 5 },
          },
          {
            id: '7',
            match: { relative: 40, absolute: 40 },
            votingSession: { present: 10, sameVote: 4 },
          },
          {
            id: '8',
            match: { relative: 30, absolute: 30 },
            votingSession: { present: 10, sameVote: 3 },
          },
          {
            id: '9',
            match: { relative: 20, absolute: 20 },
            votingSession: { present: 10, sameVote: 2 },
          },
          {
            id: '10',
            match: { relative: 10, absolute: 10 },
            votingSession: { present: 10, sameVote: 1 },
          },
          {
            id: '11',
            match: { relative: 0, absolute: 0 },
            votingSession: { present: 10, sameVote: 0 },
          },
        ]
      );
    });
  });

  describe('Método bestMatches', () => {
    it('deve existir', () => {
      expect(typeof congress.bestMatches).toBe('function');
    });

    it('deve receber como parâmetro uma lista de matches', () => {
      expect(
        () => { return congress.bestMatches() }
      ).toThrow(
        'A função deve receber uma lista de matches como um array!',
      );

      expect(
        () => { return congress.bestMatches(1) }
      ).toThrow(
        'A função deve receber uma lista de matches como um array!',
      );
    });

    it('deve receber uma lista de matches com pelo menos 10 elementos', () => {
      expect(
        () => { return congress.bestMatches([{ '1': 'Teste' }]) }
      ).toThrow(
        'A função deve receber uma lista de matches com pelo menos 10 elementos!',
      );
    });

    it('deve retornar no mínimo 10 elementos', () => {
      expect(congress.bestMatches(
        [
          {
            id: '1',
            match: { relative: 100, absolute: 100 },
            votingSession: { present: 10, sameVote: 10 },
          },
          {
            id: '2',
            match: { relative: 90, absolute: 90 },
            votingSession: { present: 10, sameVote: 9 },
          },
          {
            id: '3',
            match: { relative: 80, absolute: 80 },
            votingSession: { present: 10, sameVote: 8 },
          },
          {
            id: '4',
            match: { relative: 70, absolute: 70 },
            votingSession: { present: 10, sameVote: 7 },
          },
          {
            id: '5',
            match: { relative: 60, absolute: 60 },
            votingSession: { present: 10, sameVote: 6 },
          },
          {
            id: '6',
            match: { relative: 50, absolute: 50 },
            votingSession: { present: 10, sameVote: 5 },
          },
          {
            id: '7',
            match: { relative: 40, absolute: 40 },
            votingSession: { present: 10, sameVote: 4 },
          },
          {
            id: '8',
            match: { relative: 30, absolute: 30 },
            votingSession: { present: 10, sameVote: 3 },
          },
          {
            id: '9',
            match: { relative: 20, absolute: 20 },
            votingSession: { present: 10, sameVote: 2 },
          },
          {
            id: '10',
            match: { relative: 10, absolute: 10 },
            votingSession: { present: 10, sameVote: 1 },
          },
          {
            id: '11',
            match: { relative: 0, absolute: 0 },
            votingSession: { present: 10, sameVote: 0 },
          },
        ]
      ).length).toBeGreaterThanOrEqual(10);
    });

    it('deve retornar no máximo 10 posições diferentes', () => {
      const bestMatches = congress.bestMatches(
        [
          {
            id: '1',
            match: { relative: 100, absolute: 100 },
            votingSession: { present: 10, sameVote: 10 },
          },
          {
            id: '2',
            match: { relative: 90, absolute: 90 },
            votingSession: { present: 10, sameVote: 9 },
          },
          {
            id: '3',
            match: { relative: 80, absolute: 80 },
            votingSession: { present: 10, sameVote: 8 },
          },
          {
            id: '4',
            match: { relative: 70, absolute: 70 },
            votingSession: { present: 10, sameVote: 7 },
          },
          {
            id: '5',
            match: { relative: 60, absolute: 60 },
            votingSession: { present: 10, sameVote: 6 },
          },
          {
            id: '6',
            match: { relative: 50, absolute: 50 },
            votingSession: { present: 10, sameVote: 5 },
          },
          {
            id: '7',
            match: { relative: 40, absolute: 40 },
            votingSession: { present: 10, sameVote: 4 },
          },
          {
            id: '8',
            match: { relative: 30, absolute: 30 },
            votingSession: { present: 10, sameVote: 3 },
          },
          {
            id: '9',
            match: { relative: 20, absolute: 20 },
            votingSession: { present: 10, sameVote: 2 },
          },
          {
            id: '10',
            match: { relative: 10, absolute: 10 },
            votingSession: { present: 10, sameVote: 1 },
          },
          {
            id: '11',
            match: { relative: 0, absolute: 0 },
            votingSession: { present: 10, sameVote: 0 },
          },
        ]
      );
      
      let counter = 1;
      
      for (let i = 0; i < bestMatches.length - 1; i += 1) {
        if (bestMatches[i].match.absolute !== bestMatches[i + 1].match.absolute) {
          counter += 1;
        }
      }

      expect(counter).toBeLessThanOrEqual(10);
    });
  });

  describe('Método populateCongressmen', () => {
    it('deve existir', () => {
      expect(typeof congress.populateCongressmen).toBe('function');
    });

    it('deve receber uma lista de ids deputados como um array', () => {
      expect(
        () => { return congress.populateCongressmen() }
      ).toThrow(
        'A função deve receber uma lista de ids de deputados como um array!',
      );

      expect(
        () => { return congress.populateCongressmen(1) }
      ).toThrow(
        'A função deve receber uma lista de ids de deputados como um array!',
      );
    });

    it('deve retornar toda a lista de deputados populados', (done) => {
      congress.populateCongressmen([
        { 'id': 1, 'votingSession': {}, 'match': {} },
        { 'id': 2, 'votingSession': {}, 'match': {} },
      ])
        .then((congressmen) => {
          congressmen.forEach(congressman => {
            expect(congressman.id).toBeTruthy();
            expect(congressman.nome).toBeTruthy();
            expect(congressman.siglaUf).toBeTruthy();
            expect(congressman.siglaPartido).toBeTruthy();
            expect(congressman.idLegislatura).toBeTruthy();
            expect(congressman.urlFoto).toBeTruthy();
            expect(congressman.email).toBeTruthy();
            expect(congressman.uri).toBeTruthy();
          });
          done();
        })
        .catch(e => done(e));
    });
  });
});

// afterEach((done) => {
// });

after(() => {
  mongoose.connection.db.dropDatabase()
    .then(() => {
      mongoose.connection.close();
    });
});
