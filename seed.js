const async = require('async');
const axios = require('axios');
const mongoose = require('mongoose');
const Deputados = require('./models/Deputados');
const Votacoes = require('./models/Votacoes');
const Proposicoes = require('./models/Proposicoes');

mongoose.connect('mongodb://localhost/me-representa', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

// axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura=56&ordem=ASC&ordenarPor=nome')
//   .then(result => {
//     console.log(result.data.dados.length);
//     const deputados = result.data.dados.map(deputado => {
//       delete deputado.uriPartido;
//       return deputado;
//     });
//     Deputados.create(deputados)
//       .then(() => {
//         console.log('Deputados inseridos com sucesso!');
//         mongoose.connection.close();
//       });
//   })
//   .catch(e => {
//     console.log(e);
//   });

/*
*******************************************
*****  SEMPRE RODAR TODAS AS PAGINAS  *****
*******************************************
*/
// axios.get('https://dadosabertos.camara.leg.br/api/v2/votacoes?dataInicio=2020-01-01&dataFim=2020-04-30&itens=200&ordem=DESC&ordenarPor=dataHoraRegistro&pagina=3')
//   .then(result => {
//     const votacoes = result.data.dados.map(votacao => {
//       delete votacao.data;
//       delete votacao.uriOrgao;
//       delete votacao.uriEvento;
//       return votacao;
//     });
//     Votacoes.create(votacoes)
//       .then(() => {
//         console.log('Votações inseridas com sucesso!');
//         mongoose.connection.close();
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   });

const fnArr = [];

Votacoes.find()
  .then(result => {
    let i = 0;
    result.forEach(vot => {
      fnArr.push((callback) => {
        console.log('1');
        axios.get(vot.uri)
        .then(resultado => {
          console.log('2');
          if (resultado.data.dados.efeitosRegistrados && resultado.data.dados.efeitosRegistrados.length > 0) {
            console.log('3');
            const setURIs = new Set();
            resultado.data.dados.efeitosRegistrados.forEach(efeitoRegistrado => {
              console.log('4');
              if (!setURIs.has(efeitoRegistrado.uriProposicao)) {
                setURIs.add(efeitoRegistrado.uriProposicao);
                axios.get(efeitoRegistrado.uriProposicao)
                .then(resultadoProposicao => {
                  const dados = resultadoProposicao.data.dados;
                  delete dados.uriOrgaoNumerador;
                  delete dados.uri;
                  delete dados.codTipo;
                  delete dados.statusProposicao;
                  delete dados.descricaoTipo;
                  delete dados.ementaDetalhada;
                  delete dados.keywords;
                  delete dados.uriPropPrincipal;
                  delete dados.uriPropAnterior;
                  delete dados.uriPropPosterior;
                  delete dados.urnFinal;
                  delete dados.texto;
                  delete dados.justificativa;
                  Proposicoes.find({ id: dados.id })
                    .then((proposicoes) => {
                      if (proposicoes.length > 0) {
                        Votacoes.findOneAndUpdate({ id: vot.id }, { $push: { proposicoes: proposicoes[0]._id }}, { new: true })
                        .then((resultadoDoUpdate) => {
                          console.log(resultadoDoUpdate, 'entrou no then');
                          console.log(`Terminou a ${++i}`);
                          callback();
                        });
                      } else {
                        Proposicoes.create(dados)
                        .then((proposicaoCriada) => {
                          console.log(vot.id);
                          Votacoes.findOneAndUpdate({ id: vot.id }, { $push: { proposicoes: proposicaoCriada._id }}, { new: true })
                            .then((resultadoDoUpdate) => {
                              console.log(resultadoDoUpdate, 'entrou no then');
                              console.log(`Terminou a ${++i}`);
                              callback();
                            });
                        });
                      }
                    });
                })
                .catch(e => {
                  console.log(e, '2');
                  console.log(`Terminou a ${++i}`);
                  callback();
                });
              }
            });
          } else {
            console.log(`Terminou a ${++i}`);
            callback();
          }
        })
        .catch(e => {
          console.log(e, '1');
          console.log(`Terminou a ${++i}`);
          callback();
        })
      });
    })
    async.series(fnArr, () => {
      console.log('terminou a série ?????');
    });
  });
