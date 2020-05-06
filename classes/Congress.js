const Congressmen = require('../models/Congressmen');
const VotingSession = require('../models/VotingSession');

class Congress {
  constructor(topMatchLimit = 10) {
    this.topMatchLimit = topMatchLimit;
  };

  match(voteList) {
    if (!voteList || !voteList.votes || Object.keys(voteList.votes).length < 1) {
      throw new Error('A função deve receber uma lista de votos como um objeto contendo a propriedade votos!');
    }

    return new Promise((resolve, reject) => {
      VotingSession.find({ id: { $in: Object.keys(voteList.votes) }})
      .then((votingSessions) => {
          const congressmen = {};
          votingSessions.forEach((votingSession) => {
            for (const key in votingSession.votes) {
              if (!congressmen[key]) {
                congressmen[key] = {
                  present: 0,
                  sameVote: 0,
                }
              }
              congressmen[key].present += 1;
              if (votingSession.votes[key] === voteList.votes[votingSession.id]) {
                congressmen[key].sameVote += 1;
              }
            }
          });
          let matches = this.sortMatches(congressmen, Object.keys(voteList.votes).length);
          matches = this.bestMatches(matches);
          this.populateCongressmen(matches)
            .then((topMatches) => {
              resolve(topMatches);
            });
        })
        .catch(e => reject(e));
    });
  }

  sortMatches(congressmen, totalVotes) {
    let congressmenList;
    if (!congressmen || typeof congressmen !== 'object') {
      throw new Error('A função deve receber uma lista de deputados como um objeto ou um array!');
    }

    if (!totalVotes || typeof totalVotes !== 'number') {
      throw new Error ('O segundo parâmetro deve ser o número total de votações do usuário (Number)!');
    }

    if (!congressmen.length) {
      congressmenList = [];
      for (const key in congressmen) {
        congressmenList.push({ ...congressmen[key], id: key });
      }
    } else {
      congressmenList = [...congressmen];
    }

    const sortedList = [];

    congressmenList.forEach((congressman) => {
      if (!(congressman.present !== undefined && congressman.sameVote !== undefined)) {
        throw new Error('Os objetos na lista de deputados devem ter as propriedades "present" (Number) e "sameVote" (Number)!');
      }

      sortedList.push({
        id: congressman.id,
        match: {
          relative: (congressman.sameVote / congressman.present) * 100,
          absolute: (congressman.sameVote / totalVotes) * 100,
        },
        votingSession: {
          present: congressman.present,
          sameVote: congressman.sameVote,
        },
      });
    });

    return sortedList.sort((a, b) => b.match.absolute - a.match.absolute);
  }

  bestMatches(sortedListMatches) {
    if (!sortedListMatches || !Array.isArray(sortedListMatches)) {
      throw new Error('A função deve receber uma lista de matches como um array!');
    }

    if (sortedListMatches.length < this.topMatchLimit) {
      throw new Error('A função deve receber uma lista de matches com pelo menos 10 elementos!');
    }

    let counter = 1;
    const congressmenArr = [sortedListMatches[0]];

    for (let i = 1; i < sortedListMatches.length - 1; i += 1) {
      if (sortedListMatches[i].match.absolute !== sortedListMatches[i - 1].match.absolute) {
        if (counter < this.topMatchLimit && congressmenArr.length < 10) {
          counter += 1;
          congressmenArr.push(sortedListMatches[i]);
        } else {
          break;
        }
      } else {
        congressmenArr.push(sortedListMatches[i]);
      }
    }
    return congressmenArr;
  }

  populateCongressmen(congressmenList) {
    if (!congressmenList || !Array.isArray(congressmenList)) {
      throw new Error('A função deve receber uma lista de ids de deputados como um array!');
    }

    const congressmenIds = congressmenList.map((congressman) => congressman.id);
    return new Promise((resolve, reject) => {
      Congressmen.find({ id: { $in: congressmenIds }})
        .then((congressmenInfo) => {
          const populatedInfo = congressmenList.map((congressman) => {
            for (let i = 0; i < congressmenInfo.length; i += 1) {
              if (parseInt(congressman.id, 10) === parseInt(congressmenInfo[i].id, 10)) {
                const temp = congressmenInfo.splice(i, 1);
                return {
                  ...temp[0]._doc,
                  ...congressman,
                  // match: temp[0].match,
                  // votingSession: temp[0].votingSession,
                };
              }
            }
          });
          resolve(populatedInfo);
        })
        .catch(e => reject(e));
    });
  }
}

module.exports = Congress;
