const { anime_typeDefs } = require("./typeDefs_schema/anime_typedef.js");
const { genre_typeDefs } = require("./typeDefs_schema/genre_typedef");
const { licensor_typeDefs } = require("./typeDefs_schema/licensor_typedef");
const { producer_typeDefs } = require("./typeDefs_schema/producer_typedef");
const { studio_typeDefs } = require("./typeDefs_schema/studio_typedef.js");

const typeDefs = [
  anime_typeDefs,
  genre_typeDefs,
  licensor_typeDefs,
  producer_typeDefs,
  studio_typeDefs,
];

module.exports = { typeDefs };
