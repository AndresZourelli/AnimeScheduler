revoke update (watch_status) on anime_app_public.user_watch_status from anime_user;
revoke insert (anime_list_id, anime_id) on anime_app_public.user_anime_lists from anime_user;
revoke insert (user_id, title, privacy) on anime_app_public.anime_lists from anime_user;

drop policy update_user_watch_statuses on anime_app_public.user_watch_status; 
drop policy insert_user_anime_lists on anime_app_public.user_anime_lists; 
drop policy insert_anime_lists on anime_app_public.anime_lists;