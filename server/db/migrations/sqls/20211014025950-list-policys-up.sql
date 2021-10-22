/* Replace with your SQL commands */
alter table anime_app_public.anime_lists enable row level security;
alter table anime_app_public.user_anime_lists enable row level security;
alter table anime_app_public.user_watch_status enable row level security;

grant anime_default to anime_app_postgraphile;
grant anime_user TO anime_app_postgraphile;
grant anime_moderator TO anime_app_postgraphile;
grant anime_admin to anime_app_postgraphile;

grant usage on schema anime_app_public to anime_default, anime_app_postgraphile;
grant select on anime_app_public.anime_lists to anime_user;
grant execute on function anime_app_public.current_user() to anime_user;

create policy select_user_lists on anime_app_public.anime_lists for select to anime_user using (user_id = nullif(current_setting('jwt.claims.user_id', true), ''));
create policy select_user_watch_status on anime_app_public.user_watch_status for select to anime_user using (user_id = nullif(current_setting('jwt.claims.user_id', true), ''));
create policy select_user_anime_lists on anime_app_public.user_anime_lists for select to anime_user using (EXISTS(select anime_app_public.current_user()));
create function anime_app_public.current_role()
    RETURNS text
    AS $$
DECLARE
    role_name text;
BEGIN
    SELECT NULLIF(current_setting('jwt.claims.role', true), '')::text into role_name;
    RETURN role_name;
END;
$$ language plpgsql stable;


