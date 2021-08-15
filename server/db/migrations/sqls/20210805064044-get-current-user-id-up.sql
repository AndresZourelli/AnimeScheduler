CREATE FUNCTION anime_app_public.current_user()
    RETURNS text
    AS $$
DECLARE
    user_id text;
BEGIN
    SELECT NULLIF(current_setting('jwt.claims.user_id', true), '')::text into user_id;
    RETURN user_id;
END;
$$ language plpgsql stable;