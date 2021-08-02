// Update with your config settings.
require("dotenv").config({ debug: true, path: "../.env" });

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.POSTGRES_HOST.trim(),
      database: process.env.POSTGRES_DB.trim(),
      user: process.env.POSTGRES_USER.trim(),
      password: process.env.POSTGRES_PASSWORD.trim(),
      port: process.env.POSTGRES_PORT.trim(),
    },
    debug: true,
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
