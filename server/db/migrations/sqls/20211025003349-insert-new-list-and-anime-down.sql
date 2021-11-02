revoke execute on function anime_app_public.create_new_list_add_anime(uuid) from anime_user;
revoke execute on function anime_app_public.insert_or_update_anime_user_score(uuid, integer) from anime_user;

drop function anime_app_public.create_new_list_add_anime(uuid);
drop function anime_app_public.insert_or_update_anime_user_score(uuid, integer);

revoke insert on anime_app_public.anime_user_score from anime_user;
revoke update on anime_app_public.anime_user_score from anime_user;
revoke select on anime_app_public.anime_user_score from anime_user;

drop policy update_anime_user_score on anime_app_public.anime_user_score;
drop policy insert_anime_user_score on anime_app_public.anime_user_score;
drop policy select_anime_user_score on anime_app_public.anime_user_score;

ALTER TABLE anime_app_public.anime_user_score DISABLE ROW LEVEL SECURITY;