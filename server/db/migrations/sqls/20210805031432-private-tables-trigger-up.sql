CREATE FUNCTION anime_app_public.register_user(user_id text, username text, email text) 
    RETURNS  anime_app_public.users
    AS $$
DECLARE
    user anime_app_public.users;
BEGIN
    INSERT INTO anime_app_public.users (id) VALUES (user_id) RETURNING * INTO user;
    INSERT INTO anime_app_private.users (user_id, username, email) VALUES (user_id, username, email);
    RETURN user;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;