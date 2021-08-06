CREATE FUNCTION insert_user() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO anime_app_public.users (username) VALUES (NEW.username) RETURNING id INTO NEW.user_id;
    INSERT INTO anime_app_private.verify_emails (user_id) VALUES (NEW.user_id);
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER insert_user BEFORE INSERT ON anime_app_private.users FOR EACH ROW EXECUTE PROCEDURE insert_user();