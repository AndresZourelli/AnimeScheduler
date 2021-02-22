const { merge } = require("lodash");
const { animeResolver } = require("./resolvers/animeRes");
const { genreResolver } = require("./resolvers/genreRes");
const { licensorResolver } = require("./resolvers/licensorRes");
const { producerResolver } = require("./resolvers/producerRes");
const { studioResolver } = require("./resolvers/studioRes");
const { userResolver } = require("./resolvers/userRes");
const { authResolver } = require("./resolvers/authRes");

const resolvers = merge(
  {},
  animeResolver,
  genreResolver,
  licensorResolver,
  producerResolver,
  studioResolver,
  userResolver,
  authResolver
);

module.exports = { resolvers };
