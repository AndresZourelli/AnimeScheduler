CREATE TABLE anime_app_private.users (
    user_id text PRIMARY KEY REFERENCES anime_app_public.users(id) ON DELETE CASCADE NOT NULL,
    username text UNIQUE,
    email text UNIQUE NOT NULL,
    active boolean NOT NULL DEFAULT FALSE,
    role text NOT NULL DEFAULT 'anime_user'
);
