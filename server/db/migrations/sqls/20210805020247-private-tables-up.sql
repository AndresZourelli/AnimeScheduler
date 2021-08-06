CREATE TABLE anime_app_private.users (
    user_id uuid PRIMARY KEY REFERENCES anime_app_public.users(id) ON DELETE CASCADE NOT NULL,
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    hashed_password text NOT NULL,
    refresh_token_key uuid NOT NULL DEFAULT uuid_generate_v4(),
    active boolean NOT NULL DEFAULT FALSE,
    role text NOT NULL DEFAULT 'anime_user'
);

CREATE TABLE anime_app_private.verify_emails (
    user_id uuid PRIMARY KEY REFERENCES anime_app_public.users(id) ON DELETE CASCADE NOT NULL,
    verify_email_key uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamptz NOT NULL DEFAULT NOW()
);