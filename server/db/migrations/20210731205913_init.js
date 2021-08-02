exports.up = (knex) =>
  knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable("images", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("title").notNullable();
      table.string("url").notNullable();
    })
    .createTable("source_material_types", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("source_material_type").unique();
    })
    .createTable("age_rating_types", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("age_rating_type").unique();
    })
    .createTable("media_types", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("media_type").unique();
    })
    .createTable("seasons", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("season").unique();
    })
    .createTable("airing_status_types", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("airing_status_type").unique();
    })
    .createTable("animes", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.integer("mal_id").unique();
      table.string("title");
      table.string("description", 6000);
      table.integer("number_of_episodes").defaultTo(1);
      table.integer("duration");
      table.decimal("average_watcher_rating").defaultTo(0.0);
      table.timestamp("start_broadcast_datetime", { useTz: true });
      table.timestamp("end_broadcast_datetime", { useTz: true });
      table
        .uuid("profile_image_id")
        .references("id")
        .inTable("images")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("airing_status_id")
        .references("id")
        .inTable("airing_status_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("media_type_id")
        .references("id")
        .inTable("media_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("season_id")
        .references("id")
        .inTable("seasons")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("source_material_id")
        .references("id")
        .inTable("source_material_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("age_rating_id")
        .references("id")
        .inTable("age_rating_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
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
    .createTable("genres", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("genre").notNullable().unique();
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
      table
        .uuid("genre_id")
        .references("id")
        .inTable("genres")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("producers", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("producer").notNullable().unique();
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
      table
        .uuid("producer_id")
        .references("id")
        .inTable("producers")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("licensors", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("licensor").notNullable().unique();
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
      table
        .uuid("licensor_id")
        .references("id")
        .inTable("licensors")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("studios", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("studio").notNullable().unique();
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
      table
        .uuid("studio_id")
        .references("id")
        .inTable("studios")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })

    .createTable("persons", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.integer("mal_id").unique();
      table.string("first_name").notNullable();
      table.string("last_name");
      table.string("native_name");
      table.string("alternate_names", 500);
      table.string("description", 6000);
      table
        .uuid("person_image_id")
        .references("id")
        .inTable("images")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
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
        .uuid("staff_role_id")
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
      table.string("description", 6000);
      table
        .uuid("character_image_id")
        .references("id")
        .inTable("images")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("character_roles", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("role").notNullable().unique();
    })
    .createTable("languages", (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("language").notNullable().unique();
    })
    .createTable("anime_character", (table) => {
      table
        .uuid("anime_id")
        .references("id")
        .inTable("animes")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
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
      table
        .uuid("character_role_id")
        .references("id")
        .inTable("character_roles")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .uuid("language_id")
        .references("id")
        .inTable("languages")
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.primary(["anime_id", "character_id", "person_id", "language_id"]);
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
    .createTable("person_images", (table) => {
      table
        .uuid("person_id")
        .references("id")
        .inTable("persons")
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
      table.primary(["person_id", "image_id"]);
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
    .dropTable("source_material_types")
    .dropTable("age_rating_types")
    .dropTable("media_types")
    .dropTable("seasons")
    .dropTable("airing_status_types")
    .dropTable("animes")
    .dropTable("persons")
    .dropTable("staff_roles")
    .dropTable("characters")
    .dropTable("alternate_anime_names")
    .dropTable("genres")
    .dropTable("producers")
    .dropTable("licensors")
    .dropTable("studios")
    .dropTable("anime_genre")
    .dropTable("anime_producer")
    .dropTable("anime_licensor")
    .dropTable("anime_studio")
    .dropTable("anime_staff")
    .dropTable("character_roles")
    .dropTable("languages")
    .dropTable("anime_character")
    .dropTable("images")
    .dropTable("character_images")
    .dropTable("anime_images")
    .dropTable("person_images")
    .dropTable("users")
    .dropTable("anime_user_score")
    .dropTable("user_anime");
