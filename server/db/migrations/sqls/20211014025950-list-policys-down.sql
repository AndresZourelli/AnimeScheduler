alter table anime_app_public.anime_lists disable row level security;
alter table anime_app_public.user_anime_lists disable row level security;
alter table anime_app_public.user_watch_status disable row level security;

drop policy select_user_lists on anime_app_public.anime_lists;
drop policy select_user_watch_status on anime_app_public.user_watch_status;
drop policy select_user_anime_lists on anime_app_public.user_anime_lists;

-- revoke select on anime_app_public.anime_lists from anime_user;
-- revoke execute on function anime_app_public.current_user() from anime_user;
revoke anime_default from anime_app_postgraphile;
revoke anime_user from anime_app_postgraphile;
revoke anime_moderator from anime_app_postgraphile;
revoke anime_admin from anime_app_postgraphile;
-- revoke usage on schema anime_app_public from anime_default, anime_app_postgraphile;
drop function anime_app_public.current_role();