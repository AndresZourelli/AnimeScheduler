const knex = require("knex");
const { Model } = require("objection");
require("dotenv").config();

const connectionConfig = {
  client: "pg",
  connection: {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  },
  debug: true
};

const connection = knex(connectionConfig);
Model.knex(connection);

module.exports = connection;
