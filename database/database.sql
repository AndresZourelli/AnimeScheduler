BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS animes (
    anime_id SERIAL PRIMARY KEY,
    mal_anime_id INT,
    anime_title VARCHAR(255) NOT NULL,
    anime_description TEXT NOT NULL,
    number_of_episodes INT,
    fk_airing_status_type_id INT NOT NULL,
    fk_media_type_id INT NOT NULL,
    start_broadcast_datetime TIMESTAMP WITH TIME ZONE,
    end_broadcast_datetime TIMESTAMP WITH TIME ZONE,
    fk_season_id INT,
    fk_source_material_id INT NOT NULL,
    duration INT NOT NULL,
    primary_image_url VARCHAR(255),
    average_rating REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS source_material_types (
    source_material_type_id SERIAL PRIMARY KEY,
    source_material_type_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS media_types (
    media_type_id SERIAL PRIMARY KEY,
    media_type_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS seasons (
    season_id SERIAL PRIMARY KEY,
    season_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS airing_status_types (
    airing_status_type_id SERIAL PRIMARY KEY,
    airing_status_type_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings (
    rating_id SERIAL PRIMARY KEY,
    fk_user_id INT NOT NULL,
    fk_anime_id INT NOT NULL,
    rating INT NOT NULL
);

CREATE TABLE IF NOT EXISTS alt_name_types (
    alt_name_type_id SERIAL PRIMARY KEY,
    alt_name_type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS alt_anime_names (
    alt_anime_name_id SERIAL PRIMARY KEY,
    alt_name VARCHAR(255) NOT NULL,
    fk_alt_name_type_id INT NOT NULL,
    fk_anime_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS anime_genre (
    anime_genre_id SERIAL PRIMARY KEY,
    fk_anime_id INT NOT NULL,
    fk_genre_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS producers (
    producer_id SERIAL PRIMARY KEY,
    producer_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS anime_producer (
    anime_producer_id SERIAL PRIMARY KEY,
    fk_anime_id INT NOT NULL,
    fk_producer_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS studios (
    studio_id SERIAL PRIMARY KEY,
    studio_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS anime_studio (
    anime_studio_id SERIAL PRIMARY KEY,
    fk_anime_id INT NOT NULL,
    fk_studio_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS licensors (
    licensor_id SERIAL PRIMARY KEY,
    licensor_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS anime_licensor (
    anime_licensor_id SERIAL PRIMARY KEY,
    fk_anime_id INT NOT NULL,
    fk_licensor_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS staff (
    staff_id SERIAL PRIMARY KEY,
    mal_staff_id INT NOT NULL ,
    staff_name VARCHAR(255),
    fk_staff_primary_image INT
);

CREATE TABLE IF NOT EXISTS anime_staff (
    anime_staff_id SERIAL PRIMARY KEY,
    fk_anime_id INT NOT NULL,
    fk_staff_id INT NOT NULL,
    fk_staff_role_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS staff_roles (
    staff_role_id SERIAL PRIMARY KEY,
    staff_role_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS actors (
    actor_id SERIAL PRIMARY KEY,
    mal_actor_id INT NOT NULL,
    actor_name VARCHAR(255),
    fk_actor_primary_image INT
);

CREATE TABLE IF NOT EXISTS anime_actor (
    anime_actor_id SERIAL PRIMARY KEY,
    fk_anime_id INT NOT NULL,
    fk_actor_id INT NOT NULL,
    fk_language_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS languages (
    language_id SERIAL PRIMARY KEY,
    language_name VARCHAR(255) NOT NULL 
);

CREATE TABLE IF NOT EXISTS characters (
    character_id SERIAL PRIMARY KEY,
    mal_character_id INT NOT NULL ,
    character_name VARCHAR(255),
    fk_character_primary_image INT
);

CREATE TABLE IF NOT EXISTS anime_character (
    anime_character_id SERIAL PRIMARY KEY,
    fk_anime_id INT NOT NULL,
    fk_character_id INT NOT NULL,
    fk_character_role_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS character_actors (
    character_actor_id SERIAL PRIMARY KEY,
    fk_character_id INT NOT NULL,
    fk_actor_id INT NOT NULL,
    fk_language_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS character_roles (
    character_role_id SERIAL PRIMARY KEY,
    character_role_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
    image_id SERIAL PRIMARY KEY,
    image_name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS character_images (
    character_image_id SERIAL PRIMARY KEY,
    fk_character_id INT NOT NULL,
    fk_image_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS anime_images (
    anime_image_id SERIAL PRIMARY KEY,
    fk_anime_id INT NOT NULL,
    fk_image_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS staff_images (
    staff_image_id SERIAL PRIMARY KEY,
    fk_staff_id INT NOT NULL,
    fk_image_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    displayname VARCHAR(63) NOT NULL,
    email VARCHAR(255) NOT NULL ,
    password VARCHAR(255) NOT NULL,
    refresh_token_verification_code VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verify_email_key VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_role_id SERIAL PRIMARY KEY,
    fk_user_id INT NOT NULL,
    fk_role_id INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS anime_user (
    anime_user_id SERIAL PRIMARY KEY,
    fk_anime_id INT NOT NULL,
    fk_user_id INT NOT NULL,
    fk_watch_type_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS watch_types (
    watch_type_id SERIAL PRIMARY KEY,
    watch_type_name VARCHAR(255) NOT NULL
);

/* Create functions to update users table if anything is changed
 ================================================================= */
-- trigger for update created_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--trigger for adding default role
CREATE OR REPLACE FUNCTION add_default_role() 
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT * FROM user_roles WHERE fk_user_id = NEW.user_id) IS NULL THEN
        INSERT INTO user_roles (fk_user_id, fk_role_id) VALUES (NEW.user_id, (SELECT role_id FROM security_roles WHERE role_name = "user"));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users table
DROP TRIGGER IF EXISTS set_timestamp_users on users;
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- user_roles table
DROP TRIGGER IF EXISTS set_timestamp_user_roles on user_roles;
CREATE TRIGGER set_timestamp_user_roles
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- trigger for adding user
DROP TRIGGER IF EXISTS set_default_role on users;
CREATE TRIGGER set_default_role
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION add_default_role();
/* 
    Add Foreign Key constraints
*/
ALTER TABLE animes ADD CONSTRAINT fk_anime_airing_status FOREIGN KEY (fk_airing_status_type_id) REFERENCES airing_status_types (airing_status_type_id) ON DELETE CASCADE;
ALTER TABLE animes ADD CONSTRAINT fk_anime_media_type FOREIGN KEY (fk_media_type_id) REFERENCES media_types (media_type_id) ON DELETE CASCADE;
ALTER TABLE animes ADD CONSTRAINT fk_anime_season FOREIGN KEY (fk_season_id) REFERENCES seasons (season_id) ON DELETE CASCADE;
ALTER TABLE animes ADD CONSTRAINT fk_anime_source_material FOREIGN KEY (fk_source_material_id) REFERENCES source_material_types (source_material_type_id) ON DELETE CASCADE;

ALTER TABLE ratings ADD CONSTRAINT fk_rating_user FOREIGN KEY (fk_user_id) REFERENCES users (user_id) ON DELETE CASCADE;
ALTER TABLE ratings ADD CONSTRAINT fk_rating_anime FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE ratings ADD UNIQUE (fk_user_id, fk_anime_id);

ALTER TABLE anime_genre ADD CONSTRAINT fk_anime_genre FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE anime_genre ADD CONSTRAINT fk_genre FOREIGN KEY (fk_genre_id) REFERENCES genres (genre_id) ON DELETE CASCADE;
ALTER TABLE anime_genre ADD UNIQUE (fk_genre_id, fk_anime_id);

ALTER TABLE staff ADD CONSTRAINT fk_staff_primary_image FOREIGN KEY (fk_staff_primary_image) REFERENCES staff_images (staff_image_id) ON DELETE CASCADE;

ALTER TABLE anime_staff ADD CONSTRAINT fk_anime_staff FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE anime_staff ADD CONSTRAINT fk_anime_staff_staff FOREIGN KEY (fk_staff_id) REFERENCES staff (staff_id) ON DELETE CASCADE;
ALTER TABLE anime_staff ADD CONSTRAINT fk_staff_role FOREIGN KEY (fk_staff_role_id) REFERENCES staff_roles (staff_role_id) ON DELETE CASCADE;
ALTER TABLE anime_staff ADD UNIQUE (fk_anime_id, fk_staff_id, fk_staff_role_id);

ALTER TABLE actors ADD CONSTRAINT fk_actor_primary_image FOREIGN KEY (fk_actor_primary_image) REFERENCES images (image_id) ON DELETE CASCADE;

ALTER TABLE anime_actor ADD CONSTRAINT fk_anime_actor FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE anime_actor ADD CONSTRAINT fk_anime_actor_actor FOREIGN KEY (fk_actor_id) REFERENCES actors (actor_id) ON DELETE CASCADE;
ALTER TABLE anime_actor ADD CONSTRAINT fk_actor_language FOREIGN KEY (fk_language_id) REFERENCES languages (language_id) ON DELETE CASCADE;
ALTER TABLE anime_actor ADD UNIQUE (fk_anime_id, fk_actor_id, fk_language_id);

ALTER TABLE characters ADD CONSTRAINT fk_character_primary_image FOREIGN KEY (fk_character_primary_image) REFERENCES character_images (character_image_id) ON DELETE CASCADE;

ALTER TABLE anime_character ADD CONSTRAINT fk_anime_character FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE anime_character ADD CONSTRAINT fk_anime_character_character FOREIGN KEY (fk_character_id) REFERENCES characters (character_id) ON DELETE CASCADE;
ALTER TABLE anime_character ADD CONSTRAINT fk_character_role FOREIGN KEY (fk_character_role_id) REFERENCES character_roles (character_role_id) ON DELETE CASCADE;
ALTER TABLE anime_character ADD UNIQUE (fk_anime_id, fk_character_id);

ALTER TABLE character_images ADD CONSTRAINT fk_character_images_character FOREIGN KEY (fk_character_id) REFERENCES characters (character_id) ON DELETE CASCADE;
ALTER TABLE character_images ADD CONSTRAINT fk_character_images_image FOREIGN KEY (fk_image_id) REFERENCES images (image_id) ON DELETE CASCADE;
ALTER TABLE character_images ADD UNIQUE (fk_character_id, fk_image_id);

ALTER TABLE anime_images ADD CONSTRAINT fk_anime_images_anime FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE anime_images ADD CONSTRAINT fk_anime_images_images FOREIGN KEY (fk_image_id) REFERENCES images (image_id) ON DELETE CASCADE;
ALTER TABLE anime_images ADD UNIQUE (fk_anime_id, fk_image_id);

ALTER TABLE staff_images ADD CONSTRAINT fk_staff_images_staff FOREIGN KEY (fk_staff_id) REFERENCES staff (staff_id) ON DELETE CASCADE;
ALTER TABLE staff_images ADD CONSTRAINT fk_staff_images_images FOREIGN KEY (fk_image_id) REFERENCES images (image_id) ON DELETE CASCADE;
ALTER TABLE staff_images ADD UNIQUE (fk_staff_id, fk_image_id);

ALTER TABLE anime_user ADD CONSTRAINT fk_anime_user_anime FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE anime_user ADD CONSTRAINT fk_anime_user_user FOREIGN KEY (fk_user_id) REFERENCES users (user_id) ON DELETE CASCADE;
ALTER TABLE anime_user ADD CONSTRAINT fk_anime_user_watch_type FOREIGN KEY (fk_watch_type_id) REFERENCES watch_types (watch_type_id) ON DELETE CASCADE;
ALTER TABLE anime_user ADD UNIQUE (fk_anime_id, fk_user_id);

ALTER TABLE user_roles ADD CONSTRAINT fk_role_user FOREIGN KEY (fk_user_id) REFERENCES users (user_id) ON DELETE CASCADE;
ALTER TABLE user_roles ADD CONSTRAINT fk_role_role FOREIGN KEY (fk_role_id) REFERENCES security_roles (role_id) ON DELETE CASCADE;
ALTER TABLE user_roles ADD UNIQUE (fk_user_id, fk_role_id);

ALTER TABLE anime_producer ADD CONSTRAINT fk_producer_anime FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE anime_producer ADD CONSTRAINT fk_producer_producer FOREIGN KEY (fk_producer_id) REFERENCES producers (producer_id) ON DELETE CASCADE;
ALTER TABLE anime_producer ADD UNIQUE (fk_anime_id, fk_producer_id);

ALTER TABLE anime_studio ADD CONSTRAINT fk_studio_anime FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE anime_studio ADD CONSTRAINT fk_studio_studio FOREIGN KEY (fk_studio_id) REFERENCES studios (studio_id) ON DELETE CASCADE;
ALTER TABLE anime_studio ADD UNIQUE (fk_anime_id, fk_studio_id);

ALTER TABLE anime_licensor ADD CONSTRAINT fk_licensor_anime FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE anime_licensor ADD CONSTRAINT fk_licensor_licensor FOREIGN KEY (fk_licensor_id) REFERENCES licensors (licensor_id) ON DELETE CASCADE;
ALTER TABLE anime_licensor ADD UNIQUE (fk_anime_id, fk_licensor_id);

ALTER TABLE alt_anime_names ADD CONSTRAINT fk_alt_anime_name_type FOREIGN KEY (fk_alt_name_type_id) REFERENCES alt_name_types (alt_name_type_id) ON DELETE CASCADE;
ALTER TABLE alt_anime_names ADD CONSTRAINT fk_alt_anime_name_anime FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON DELETE CASCADE;
ALTER TABLE alt_anime_names ADD UNIQUE(fk_alt_name_type_id, fk_anime_id);

ALTER TABLE character_actors ADD CONSTRAINT fk_character_actors_character FOREIGN KEY (fk_character_id) REFERENCES characters (character_id) ON DELETE CASCADE;
ALTER TABLE character_actors ADD CONSTRAINT fk_character_actors_actor FOREIGN KEY (fk_actor_id) REFERENCES actors (actor_id) ON DELETE CASCADE;
ALTER TABLE character_actors ADD CONSTRAINT fk_character_actors_language FOREIGN KEY (fk_language_id) REFERENCES languages (language_id) ON DELETE CASCADE;
ALTER TABLE character_actors ADD UNIQUE(fk_character_id, fk_actor_id, fk_language_id);

ALTER TABLE animes ADD UNIQUE(mal_anime_id);
ALTER TABLE staff ADD UNIQUE(mal_staff_id);
ALTER TABLE actors ADD UNIQUE(mal_actor_id);
ALTER TABLE languages ADD UNIQUE(language_name);
ALTER TABLE characters ADD UNIQUE(mal_character_id);
ALTER TABLE users ADD UNIQUE(email);
ALTER TABLE source_material_types ADD UNIQUE(source_material_type_name);
ALTER TABLE media_types ADD UNIQUE(media_type_name);
ALTER TABLE seasons ADD UNIQUE(season_name);
ALTER TABLE airing_status_types ADD UNIQUE(airing_status_type_name);
ALTER TABLE alt_name_types ADD UNIQUE(alt_name_type);
ALTER TABLE genres ADD UNIQUE(genre_name);
ALTER TABLE producers ADD UNIQUE(producer_name);
ALTER TABLE studios ADD UNIQUE(studio_name);
ALTER TABLE licensors ADD UNIQUE(licensor_name);
ALTER TABLE staff_roles ADD UNIQUE(staff_role_name);
ALTER TABLE character_roles ADD UNIQUE(character_role_name);
ALTER TABLE security_roles ADD UNIQUE(role_name);
ALTER TABLE watch_types ADD UNIQUE(watch_type_name);

COMMIT TRANSACTION;