const knex = require("knex");
const { Model } = require("objection");
const knexConfig = require("./knexfile");
require("dotenv").config();

const env = process.env.NODE_ENV || "development";

const connection = knex(knexConfig[env]);
Model.knex(connection);

module.exports = connection;
