CREATE FUNCTION anime_app_public.current_user()
    RETURNS INTEGER
    AS $$
DECLARE
    user_id integer;
BEGIN
    SELECT NULLIF(current_setting('jwt.claims.user_id', true), '')::integer into user_id;
    RETURN user_id;
END;
$$ language plpgsql stable;