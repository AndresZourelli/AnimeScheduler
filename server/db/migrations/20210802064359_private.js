exports.up = async (knex) => {
  await knex.raw("CREATE SCHEMA anime_app_private");
};

exports.down = async (knex) => {
  await knex.raw("DROP SCHEMA anime_app_private");
};
