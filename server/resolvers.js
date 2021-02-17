const { animeResolver } = require("./resolvers_def/animeResolver");
const { genreResolver } = require("./resolvers_def/genreResolver");
const { licensorResolver } = require("./resolvers_def/licensorResolver");
const { producerResolver } = require("./resolvers_def/producerResolver");
const { studioResolver } = require("./resolvers_def/studioResolver");
const { userResolver } = require("./resolvers_def/userResolver");
const { merge, _ } = require("lodash");

const resolvers = _.merge(
  {},
  animeResolver,
  genreResolver,
  licensorResolver,
  producerResolver,
  studioResolver,
  userResolver
);

module.exports = { resolvers };
