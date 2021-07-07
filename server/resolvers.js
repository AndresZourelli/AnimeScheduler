const { merge } = require("lodash");
const { animeResolver } = require("./resolvers/animeRes");
const { genreResolver } = require("./resolvers/genreRes");
const { licensorResolver } = require("./resolvers/licensorRes");
const { producerResolver } = require("./resolvers/producerRes");
const { studioResolver } = require("./resolvers/studioRes");
const { userResolver } = require("./resolvers/userRes");
const { authResolver } = require("./resolvers/authRes");
const { actorResolver } = require("./resolvers/actorRes");
const { characterResolver } = require("./resolvers/characterRes");
const { staffResolver } = require("./resolvers/staffRes");
const { searchResolver } = require("./resolvers/searchRes");

const resolvers = merge(
  {},
  animeResolver,
  genreResolver,
  licensorResolver,
  producerResolver,
  studioResolver,
  userResolver,
  authResolver,
  actorResolver,
  characterResolver,
  staffResolver,
  searchResolver
);

module.exports = { resolvers };
