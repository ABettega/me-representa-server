require('dotenv').config({ path: __dirname + '/../.env' });
const Camara = require('../classes/Camara');
const ModelDeputados = require('../models/Deputados');
const ModelVotacao = require('../models/Votacao');
// const ModelPergunta = require('../models/Perguntas');
const mongoose = require('mongoose');
const expect = require('expect');

let camara;

before((done) => {
  mongoose.connect(process.env.TEST_MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      ModelDeputados.create([
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
        ModelVotacao.create([
          {
            id: '1',
            votos: {
              '1': 'Sim', '2': 'Não', '3': 'Sim',
              '4': 'Sim', '5': 'Não', '6': 'Sim',
              '7': 'Sim', '8': 'Não', '9': 'Sim',
              '10': 'Sim', '11': 'Sim',
            }
          },
          {
            id: '2',
            votos: {
              '1': 'Não', '2': 'Sim', '3': 'Não',
              '4': 'Não', '5': 'Sim', '6': 'Sim',
              '7': 'Sim', '8': 'Sim', '9': 'Sim',
              '10': 'Não', '11': 'Sim',
            }
          },
          {
            id: '3',
            votos: {
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
  camara = new Camara();
});

describe('Classe Camara', () => {
  it('deve poder ser instanciada', () => {
    expect(camara instanceof Camara).toBeTruthy();
  });

  it('pode receber o limite de matches como parâmetro', () => {
    camara = new Camara(15);
    expect(camara.topMatchLimite).toBe(15);
  });

  describe('Método match', () => {
    it('deve existir', () => {
      expect(typeof camara.match).toBe('function');
    });

    it('deve receber como parâmetro um objeto com a propriedade votos', () => {
      expect(
        () => { return camara.match() }
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votos!',
      );

      expect(
        () => { return camara.match('teste') }
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votos!',
      );

      expect(
        () => { return camara.match(['teste']) }
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votos!',
      );
      
      expect(
        () => { return camara.match({ votoErro: 'Teste' }) }
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votos!',
      );
    });

    it('deve ter pelo menos uma votação realizada na propriedade votos', () => {
      expect(
        () => camara.match({ votos: {} })
      ).toThrow(
        'A função deve receber uma lista de votos como um objeto contendo a propriedade votos!'
      );
    });

    it('deve retornar uma lista de pelo menos 10 deputados', (done) => {
      camara.match({ votos: {
        '1': 'Sim',
        // '2': 'Não',
        // '3': 'Sim',
      } })
        .then((deputados) => {
          console.log(deputados);
          expect(deputados.length).toBeGreaterThanOrEqual(10);
          deputados.forEach(deputado => {
            expect(deputado.id).toBeTruthy();
            expect(deputado.nome).toBeTruthy();
            // expect(deputado.siglaUf).toBeTruthy();
            // expect(deputado.siglaPartido).toBeTruthy();
            // expect(deputado.idLegislatura).toBeTruthy();
            // expect(deputado.urlFoto).toBeTruthy();
            // expect(deputado.email).toBeTruthy();
            // expect(deputado.uri).toBeTruthy();
            // expect(deputado.match).toBeTruthy();
            // expect(deputado.votacoes).toBeTruthy();
          });
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
  });
  
  describe('Método organizarMatches', () => {
    it('deve existir', () => {
      expect(typeof camara.organizarMatches).toBe('function');
    });

    it('deve receber como primeiro parâmetro um objeto ou um array', () => {
      expect(
        () => { return camara.organizarMatches() }
      ).toThrow(
        'A função deve receber uma lista de deputados como um objeto ou um array!',
      );
  
      expect(
        () => { return camara.organizarMatches('teste', 1) }
      ).toThrow(
        'A função deve receber uma lista de deputados como um objeto ou um array!',
      );
  
      expect(
        () => { return camara.organizarMatches(['teste', 'teste2', 'teste3'], 1) }
      ).toThrow(
        'Os objetos na lista de deputados devem ter as propriedades "presente" (Number) e "votoIgual" (Number)!',
      );

      expect(
        () => { return camara.organizarMatches({ '2': { pasfdresente: 2, votoIgual: 2 }, '1': { presente: 1, votoIgual: 1 }}, 1) }
      ).toThrow(
        'Os objetos na lista de deputados devem ter as propriedades "presente" (Number) e "votoIgual" (Number)!',
      );
    });

    it('deve receber como segundo parâmetro o número total de votações do usuário', () => {
      expect(
        () => { return camara.organizarMatches({ '2': { presente: 2, votoIgual: 2 }, '1': { presente: 1, votoIgual: 1 }}) }
      ).toThrow(
        'O segundo parâmetro deve ser o número total de votações do usuário (Number)!'
      );

      expect(
        () => { return camara.organizarMatches({ '2': { presente: 2, votoIgual: 2 }, '1': { presente: 1, votoIgual: 1 }}, 'asdf') }
      ).toThrow(
        'O segundo parâmetro deve ser o número total de votações do usuário (Number)!'
      );
    });

    it('deve retornar a lista organizada', () => {
      expect(
        camara.organizarMatches(
          {
            '2': { presente: 10, votoIgual: 9 },
            '1': { presente: 10, votoIgual: 10 },
            '3': { presente: 10, votoIgual: 8 },
            '5': { presente: 10, votoIgual: 6 },
            '10': { presente: 10, votoIgual: 1 },
            '8': { presente: 10, votoIgual: 3 },
            '7': { presente: 10, votoIgual: 4 },
            '6': { presente: 10, votoIgual: 5 },
            '4': { presente: 10, votoIgual: 7 },
            '9': { presente: 10, votoIgual: 2 },
            '11': { presente: 10, votoIgual: 0 },
          },
          10
        )
      ).toEqual(
        [
          {
            id: '1',
            match: { relativo: 100, absoluto: 100 },
            votacoes: { presente: 10, votoIgual: 10 },
          },
          {
            id: '2',
            match: { relativo: 90, absoluto: 90 },
            votacoes: { presente: 10, votoIgual: 9 },
          },
          {
            id: '3',
            match: { relativo: 80, absoluto: 80 },
            votacoes: { presente: 10, votoIgual: 8 },
          },
          {
            id: '4',
            match: { relativo: 70, absoluto: 70 },
            votacoes: { presente: 10, votoIgual: 7 },
          },
          {
            id: '5',
            match: { relativo: 60, absoluto: 60 },
            votacoes: { presente: 10, votoIgual: 6 },
          },
          {
            id: '6',
            match: { relativo: 50, absoluto: 50 },
            votacoes: { presente: 10, votoIgual: 5 },
          },
          {
            id: '7',
            match: { relativo: 40, absoluto: 40 },
            votacoes: { presente: 10, votoIgual: 4 },
          },
          {
            id: '8',
            match: { relativo: 30, absoluto: 30 },
            votacoes: { presente: 10, votoIgual: 3 },
          },
          {
            id: '9',
            match: { relativo: 20, absoluto: 20 },
            votacoes: { presente: 10, votoIgual: 2 },
          },
          {
            id: '10',
            match: { relativo: 10, absoluto: 10 },
            votacoes: { presente: 10, votoIgual: 1 },
          },
          {
            id: '11',
            match: { relativo: 0, absoluto: 0 },
            votacoes: { presente: 10, votoIgual: 0 },
          },
        ]
      );
    });
  });

  describe('Método melhoresMatches', () => {
    it('deve existir', () => {
      expect(typeof camara.melhoresMatches).toBe('function');
    });

    it('deve receber como parâmetro uma lista de matches', () => {
      expect(
        () => { return camara.melhoresMatches() }
      ).toThrow(
        'A função deve receber uma lista de matches como um array!',
      );

      expect(
        () => { return camara.melhoresMatches(1) }
      ).toThrow(
        'A função deve receber uma lista de matches como um array!',
      );
    });

    it('deve receber uma lista de matches com pelo menos 10 elementos', () => {
      expect(
        () => { return camara.melhoresMatches([{ '1': 'Teste' }]) }
      ).toThrow(
        'A função deve receber uma lista de matches com pelo menos 10 elementos!',
      );
    });

    it('deve retornar no mínimo 10 elementos', () => {
      expect(camara.melhoresMatches(
        [
          {
            id: '1',
            match: { relativo: 100, absoluto: 100 },
            votacoes: { presente: 10, votoIgual: 10 },
          },
          {
            id: '2',
            match: { relativo: 90, absoluto: 90 },
            votacoes: { presente: 10, votoIgual: 9 },
          },
          {
            id: '3',
            match: { relativo: 80, absoluto: 80 },
            votacoes: { presente: 10, votoIgual: 8 },
          },
          {
            id: '4',
            match: { relativo: 70, absoluto: 70 },
            votacoes: { presente: 10, votoIgual: 7 },
          },
          {
            id: '5',
            match: { relativo: 60, absoluto: 60 },
            votacoes: { presente: 10, votoIgual: 6 },
          },
          {
            id: '6',
            match: { relativo: 50, absoluto: 50 },
            votacoes: { presente: 10, votoIgual: 5 },
          },
          {
            id: '7',
            match: { relativo: 40, absoluto: 40 },
            votacoes: { presente: 10, votoIgual: 4 },
          },
          {
            id: '8',
            match: { relativo: 30, absoluto: 30 },
            votacoes: { presente: 10, votoIgual: 3 },
          },
          {
            id: '9',
            match: { relativo: 20, absoluto: 20 },
            votacoes: { presente: 10, votoIgual: 2 },
          },
          {
            id: '10',
            match: { relativo: 10, absoluto: 10 },
            votacoes: { presente: 10, votoIgual: 1 },
          },
          {
            id: '11',
            match: { relativo: 0, absoluto: 0 },
            votacoes: { presente: 10, votoIgual: 0 },
          },
        ]
      ).length).toBeGreaterThanOrEqual(10);
    });

    it('deve retornar no máximo 10 posições diferentes', () => {
      const melhoresMatches = camara.melhoresMatches(
        [
          {
            id: '1',
            match: { relativo: 100, absoluto: 100 },
            votacoes: { presente: 10, votoIgual: 10 },
          },
          {
            id: '2',
            match: { relativo: 90, absoluto: 90 },
            votacoes: { presente: 10, votoIgual: 9 },
          },
          {
            id: '3',
            match: { relativo: 80, absoluto: 80 },
            votacoes: { presente: 10, votoIgual: 8 },
          },
          {
            id: '4',
            match: { relativo: 70, absoluto: 70 },
            votacoes: { presente: 10, votoIgual: 7 },
          },
          {
            id: '5',
            match: { relativo: 60, absoluto: 60 },
            votacoes: { presente: 10, votoIgual: 6 },
          },
          {
            id: '6',
            match: { relativo: 50, absoluto: 50 },
            votacoes: { presente: 10, votoIgual: 5 },
          },
          {
            id: '7',
            match: { relativo: 40, absoluto: 40 },
            votacoes: { presente: 10, votoIgual: 4 },
          },
          {
            id: '8',
            match: { relativo: 30, absoluto: 30 },
            votacoes: { presente: 10, votoIgual: 3 },
          },
          {
            id: '9',
            match: { relativo: 20, absoluto: 20 },
            votacoes: { presente: 10, votoIgual: 2 },
          },
          {
            id: '10',
            match: { relativo: 10, absoluto: 10 },
            votacoes: { presente: 10, votoIgual: 1 },
          },
          {
            id: '11',
            match: { relativo: 0, absoluto: 0 },
            votacoes: { presente: 10, votoIgual: 0 },
          },
        ]
      );
      
      let counter = 1;
      
      for (let i = 0; i < melhoresMatches.length - 1; i += 1) {
        if (melhoresMatches[i].match.absoluto !== melhoresMatches[i + 1].match.absoluto) {
          counter += 1;
        }
      }

      expect(counter).toBeLessThanOrEqual(10);
    });
  });

  describe('Método popularDeputados', () => {
    it('deve existir', () => {
      expect(typeof camara.popularDeputados).toBe('function');
    });

    it('deve receber uma lista de ids deputados como um array', () => {
      expect(
        () => { return camara.popularDeputados() }
      ).toThrow(
        'A função deve receber uma lista de ids de deputados como um array!',
      );

      expect(
        () => { return camara.popularDeputados(1) }
      ).toThrow(
        'A função deve receber uma lista de ids de deputados como um array!',
      );
    });

    it('deve retornar toda a lista de deputados populados', (done) => {
      camara.popularDeputados([
        { 'id': 1, 'votacoes': {}, 'match': {} },
        { 'id': 2, 'votacoes': {}, 'match': {} },
      ])
        .then((deputados) => {
          deputados.forEach(deputado => {
            expect(deputado.id).toBeTruthy();
            expect(deputado.nome).toBeTruthy();
            expect(deputado.siglaUf).toBeTruthy();
            expect(deputado.siglaPartido).toBeTruthy();
            expect(deputado.idLegislatura).toBeTruthy();
            expect(deputado.urlFoto).toBeTruthy();
            expect(deputado.email).toBeTruthy();
            expect(deputado.uri).toBeTruthy();
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
