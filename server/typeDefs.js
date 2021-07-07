const { animeDef } = require("./typeDefs/animeDef.js");
const { genreDef } = require("./typeDefs/genreDef");
const { licensorDef } = require("./typeDefs/licensorDef");
const { producerDef } = require("./typeDefs/producerDef");
const { studioDef } = require("./typeDefs/studioDef.js");
const { userDef } = require("./typeDefs/userDef");
const { authDef } = require("./typeDefs/authDef");
const { actorDef } = require("./typeDefs/actorDef");
const { characterDef } = require("./typeDefs/characterDef");
const { staffDef } = require("./typeDefs/staffDef");
const { searchDef } = require("./typeDefs/searchDef");

const typeDefs = [
  animeDef,
  genreDef,
  licensorDef,
  producerDef,
  studioDef,
  userDef,
  authDef,
  actorDef,
  characterDef,
  staffDef,
  searchDef,
];

module.exports = { typeDefs };
