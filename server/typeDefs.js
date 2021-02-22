const { animeDef } = require("./typeDefs/animeDef.js");
const { genreDef } = require("./typeDefs/genreDef");
const { licensorDef } = require("./typeDefs/licensorDef");
const { producerDef } = require("./typeDefs/producerDef");
const { studioDef } = require("./typeDefs/studioDef.js");
const { userDef } = require("./typeDefs/userDef");
const { authDef } = require("./typeDefs/authDef");

const typeDefs = [
  animeDef,
  genreDef,
  licensorDef,
  producerDef,
  studioDef,
  userDef,
  authDef,
];

module.exports = { typeDefs };
