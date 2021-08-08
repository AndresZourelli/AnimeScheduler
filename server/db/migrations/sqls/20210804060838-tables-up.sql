CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE anime_app_public.images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    url text NOT NULL
);

CREATE TABLE anime_app_public.source_material_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_material_type text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.age_rating_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    age_rating_type text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.media_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_type text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.seasons (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    season text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.airing_status_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    airing_status_type text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.animes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    mal_id integer UNIQUE,
    title text NOT NULL,
    description text,
    number_of_episodes integer DEFAULT 0,
    duration integer DEFAULT 0,
    average_watcher_rating decimal DEFAULT 0.00,
    start_broadcast_datetime timestamptz,
    end_broadcast_datetime timestamptz,
    profile_image_id uuid REFERENCES anime_app_public.images (id) ON DELETE CASCADE NOT NULL,
    airing_status_id uuid REFERENCES anime_app_public.airing_status_types (id) ON DELETE CASCADE NOT NULL,
    media_type_id uuid REFERENCES anime_app_public.media_types (id) ON DELETE CASCADE NOT NULL,
    season_id uuid REFERENCES anime_app_public.seasons (id) ON DELETE CASCADE NOT NULL,
    source_material_id uuid REFERENCES anime_app_public.source_material_types (id) ON DELETE CASCADE NOT NULL,
    age_rating_id uuid REFERENCES anime_app_public.age_rating_types (id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE anime_app_public.alternate_anime_names (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL
);

CREATE TABLE anime_app_public.genres (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    genre text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.anime_genre (
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    genre_id uuid REFERENCES anime_app_public.genres(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (anime_id, genre_id)
);

CREATE TABLE anime_app_public.producers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    producer text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.anime_producer (
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    producer_id uuid REFERENCES anime_app_public.producers(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (anime_id, producer_id)
);

CREATE TABLE anime_app_public.licensors (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    licensor text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.anime_licensor (
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    licensor_id uuid REFERENCES anime_app_public.licensors(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (anime_id, licensor_id)
);

CREATE TABLE anime_app_public.studios (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.anime_studio (
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    studio_id uuid REFERENCES anime_app_public.studios(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (anime_id, studio_id)
);

CREATE TABLE anime_app_public.persons (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    mal_id text UNIQUE,
    first_name text NOT NULL,
    last_name text,
    native_name text,
    alternate_names text,
    description text,
    person_image_id uuid REFERENCES anime_app_public.images(id) ON DELETE CASCADE
);

CREATE TABLE anime_app_public.staff_roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.anime_staff (
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    person_id uuid REFERENCES anime_app_public.persons(id) ON DELETE CASCADE NOT NULL,
    staff_role_id uuid REFERENCES anime_app_public.staff_roles (id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (anime_id, person_id, staff_role_id)
);

CREATE TABLE anime_app_public.characters (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    mal_id text UNIQUE,
    name text NOT NULL,
    description text,
    character_image_id uuid REFERENCES anime_app_public.images (id) ON DELETE CASCADE
);

CREATE TABLE anime_app_public.character_roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.languages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    language text UNIQUE NOT NULL
);

CREATE TABLE anime_app_public.anime_character (
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    character_id uuid REFERENCES anime_app_public.characters(id) ON DELETE CASCADE NOT NULL,
    person_id uuid REFERENCES anime_app_public.persons (id) ON DELETE CASCADE NOT NULL,
    character_role_id uuid REFERENCES anime_app_public.character_roles(id) ON DELETE CASCADE NOT NULL,
    language_id uuid REFERENCES anime_app_public.languages(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (anime_id, character_id, person_id, language_id)
);

CREATE TABLE anime_app_public.character_images (
    character_id uuid REFERENCES anime_app_public.characters(id) ON DELETE CASCADE NOT NULL,
    image_id uuid REFERENCES anime_app_public.images(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (character_id, image_id)
);

CREATE TABLE anime_app_public.anime_images (
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    image_id uuid REFERENCES anime_app_public.images(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (anime_id, image_id)
);

CREATE TABLE anime_app_public.person_images (
    person_id uuid REFERENCES anime_app_public.persons(id) ON DELETE CASCADE NOT NULL,
    image_id uuid REFERENCES anime_app_public.images(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (person_id, image_id)
);

CREATE TABLE anime_app_public.users (
    id text PRIMARY KEY
);

CREATE TABLE anime_app_public.user_anime (
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    user_id text REFERENCES anime_app_public.users(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (anime_id, user_id)
);

CREATE TABLE anime_app_public.anime_user_score (
    anime_id uuid REFERENCES anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    user_id text REFERENCES anime_app_public.users(id) ON DELETE CASCADE NOT NULL,
    user_score decimal NOT NULL,
    PRIMARY KEY (anime_id, user_id)
);
