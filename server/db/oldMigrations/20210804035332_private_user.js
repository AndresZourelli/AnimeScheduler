exports.up = (knex) =>
  knex.schema
    .withSchema("anime_app_private")
    .createTable("users", (table) => {
      table
        .uuid("user_id")
        .references("id")
        .inTable("public.users")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("username").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table
        .string("refresh_token_key")
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.boolean("active").defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable("verify_email", (table) => {
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("verify_email_key").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });

exports.down = (knex) =>
  knex.schema
    .withSchema("anime_app_private")
    .dropTable("users")
    .dropTable("verify_email");
