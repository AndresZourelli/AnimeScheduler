CREATE TYPE anime_app_public.small_user AS (
    user_id text,
    username text,
    email text
);

CREATE FUNCTION anime_app_public.get_user (u_id text)
    RETURNS anime_app_public.small_user AS
$$
DECLARE
    user anime_app_public.small_user;
BEGIN
    SELECT user_id, username, email INTO user FROM anime_app_private.users WHERE user_id=u_id;
    RETURN user;
END;
$$
LANGUAGE plpgsql
STABLE
SECURITY DEFINER;
