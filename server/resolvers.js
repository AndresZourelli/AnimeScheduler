const { resolverAnime } = require('./resolvers_def/animeResolver');
const { merge, _ } = require('lodash');

const resolvers = _.merge({}, resolverAnime);

module.exports = { resolvers };
