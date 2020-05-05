require('dotenv').config({ path: __dirname + '/../.env' });
const Camara = require('../classes/Camara');
const ModelDeputados = require('../models/Deputados');
// const ModelPergunta = require('../models/Perguntas');
const mongoose = require('mongoose');
const expect = require('expect');

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
    expect(camara instanceof Camara).toBeTruthy();
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

// /*
// deputado = {
//   id: { unique: true, type: Number },
//   nome: String,
//   siglaPartido: String,
//   siglaUf: String,
//   idLegislatura: Number,
//   urlFoto: String,
//   email: String,
//   uri: String,
//   votacoes: {
//     presente: X,
//     votoIgual: Y
//   },
//   match: {
//     relativo: 100%,
//     absoluto: 30%,
//   }
// }
// */

// // it('deve retornar uma lista de pelo menos 10 deputados', (done) => {
//     //   camara.match([])
//     //     .then((deputados) => {
//     //       assert(deputados.length >= 10);
//     //       deputados.forEach(deputado => {
//     //         assert.ok(deputado.id);
//     //         assert.ok(deputado.nome);
//     //         assert.ok(deputado.siglaPartido);
//     //         assert.ok(deputado.siglaUf);
//     //         assert.ok(deputado.idLegislatura);
//     //         assert.ok(deputado.urlFoto);
//     //         assert.ok(deputado.email);
//     //         assert.ok(deputado.uri);
//     //         assert.ok(deputado.match);
//     //       });
//     //       done();
//     //     })
//     //     .catch((e) => {
//     //       done(e);
//     //     });
//     // });
//     // Lista em ordem, lista com porcentagem
  });
  
  describe('Método melhoresMatches', () => {
    it('deve existir', () => {
      expect(typeof camara.melhoresMatches).toBe('function');
    });

    it('deve receber como primeiro parâmetro um objeto ou um array', () => {
      expect(
        () => { return camara.melhoresMatches() }
      ).toThrow(
        'A função deve receber uma lista de deputados como um objeto ou um array!',
      );
  
      expect(
        () => { return camara.melhoresMatches('teste', 1) }
      ).toThrow(
        'A função deve receber uma lista de deputados como um objeto ou um array!',
      );
  
      expect(
        () => { return camara.melhoresMatches(['teste', 'teste2', 'teste3'], 1) }
      ).toThrow(
        'Os objetos na lista de deputados devem ter as propriedades "presente" (Number) e "votoIgual" (Number)!',
      );

      expect(
        () => { return camara.melhoresMatches({ '2': { pasfdresente: 2, votoIgual: 2 }, '1': { presente: 1, votoIgual: 1 }}, 1) }
      ).toThrow(
        'Os objetos na lista de deputados devem ter as propriedades "presente" (Number) e "votoIgual" (Number)!',
      );
    });

    it('deve receber como segundo parâmetro o número total de votações do usuário', () => {
      expect(
        () => { return camara.melhoresMatches({ '2': { presente: 2, votoIgual: 2 }, '1': { presente: 1, votoIgual: 1 }}) }
      ).toThrow(
        'O segundo parâmetro deve ser o número total de votações do usuário (Number)!'
      );

      expect(
        () => { return camara.melhoresMatches({ '2': { presente: 2, votoIgual: 2 }, '1': { presente: 1, votoIgual: 1 }}, 'asdf') }
      ).toThrow(
        'O segundo parâmetro deve ser o número total de votações do usuário (Number)!'
      );
    });

    it('deve retornar a lista organizada contendo pelo menos dez deputados', () => {
      // SE MANDAR 11 DEVERIA RETORNAR 10
      expect(
        camara.melhoresMatches(
          {
            '2': { presente: 10, votoIgual: 9 },
            '1': { presente: 10, votoIgual: 10 },
            '3': { presente: 10, votoIgual: 8 },
            '5': { presente: 10, votoIgual: 6 },
            '10': { presente: 10, votoIgual: 0 },
            '8': { presente: 10, votoIgual: 3 },
            '7': { presente: 10, votoIgual: 4 },
            '6': { presente: 10, votoIgual: 5 },
            '4': { presente: 10, votoIgual: 7 },
            '9': { presente: 10, votoIgual: 2 },
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
            match: { relativo: 0, absoluto: 0 },
            votacoes: { presente: 10, votoIgual: 0 },
          },
        ]
      );
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
