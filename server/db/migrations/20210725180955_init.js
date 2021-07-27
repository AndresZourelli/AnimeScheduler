exports.up = (knex) =>
  knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable("animes", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.integer("mal_id").unique();
      table.string("description", 2000);
      table.integer("number_of_episodes").defaultTo(1);
      table.string("airing_status");
      table.string("media_type");
      table.string("season");
      table.string("source_material");
      table.integer("duration");
      table.string("profile_image");
      table.decimal("average_watcher_rating").defaultTo(0.0);
    })
    .createTable("alternate_anime_names", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("name").notNullable();
    })
    .createTable("anime_genre", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("genre").notNullable();
    })
    .createTable("anime_producer", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("producer").notNullable();
    })
    .createTable("anime_licensor", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("licensor").notNullable();
    })
    .createTable("anime_studio", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("studio").notNullable();
    })
    .createTable("persons", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.integer("mal_id").unique();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("native_name");
      table.string("alternate_names", 500);
      table.string("description", 2000);
      table.string("profile_image");
    })
    .createTable("staff_roles", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("role").unique().notNullable();
    })
    .createTable("anime_staff", (table) => {
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("person_id")
        .references("id")
        .inTable("persons")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("staff_rol_id")
        .references("id")
        .inTable("staff_roles")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.primary(["anime_id", "person_id", "staff_role_id"]);
    })
    .createTable("characters", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.integer("mal_id").unique();
      table.string("name").notNullable();
      table.string("description", 2000);
      table.string("profile_image");
    })
    .createTable("anime_character", (table) => {
      table.uuid("anime_id").references("id").inTable("animes").notNullable();
      table
        .uuid("character_id")
        .references("id")
        .inTable("characters")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("person_id")
        .references("id")
        .inTable("persons")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("role").notNullable();
      table.string("language").notNullable();
      table.primary(["anime_id", "character_id", "person_id", "language"]);
    })
    .createTable("images", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("title").notNullable();
      table.string("url").notNullable();
    })
    .createTable("character_images", (table) => {
      table
        .uuid("character_id")
        .references("id")
        .inTable("characters")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("image_id")
        .references("id")
        .inTable("images")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.primary(["character_id", "image_id"]);
    })
    .createTable("anime_images", (table) => {
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("image_id")
        .references("id")
        .inTable("images")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.primary(["anime_id", "image_id"]);
    })
    .createTable("people_images", (table) => {
      table
        .uuid("people_id")
        .references("id")
        .inTable("peoples")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("image_id")
        .references("id")
        .inTable("images")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.primary(["people_id", "image_id"]);
    })
    .createTable("users", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("displayname").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.string("refresh_token_key").notNullable();
      table.boolean("is_email_verified").defaultTo(false).notNullable();
      table.string("verify_email_key").notNullable();
      table.timestamps(true, true);
    })
    .createTable("user_anime", (table) => {
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.primary(["anime_id", "user_id"]);
    })
    .createTable("anime_user_score", (table) => {
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.integer("user_score").notNullable();
      table.primary(["anime_id", "user_id"]);
    });

exports.down = (knex) =>
  knex.schema
    .dropTable("animes")
    .dropTable("persons")
    .dropTable("staff_roles")
    .dropTable("characters")
    .dropTable("alternate_anime_names")
    .dropTable("anime_genre")
    .dropTable("anime_producer")
    .dropTable("anime_licensor")
    .dropTable("anime_studio")
    .dropTable("anime_staff")
    .dropTable("anime_character")
    .dropTable("images")
    .dropTable("character_images")
    .dropTable("anime_images")
    .dropTable("people_images")
    .dropTable("users")
    .dropTable("anime_user_score")
    .dropTable("user_anime");
