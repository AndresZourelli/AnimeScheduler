revoke update (user_episodes_watched) on anime_app_public.user_watch_status from anime_user;

revoke execute on function anime_app_public.animes_user_liked(anime_app_public.animes) from anime_user;
revoke execute on function anime_app_public.animes_user_watch_status(anime_app_public.animes) from anime_user;
revoke execute on function anime_app_public.animes_user_rating(anime_app_public.animes) from anime_user;
revoke execute on function anime_app_public.animes_user_episode_count(anime_app_public.animes) from anime_user;


revoke execute on function anime_app_public.all_animes_tile_user_watch_status(anime_app_public.all_animes_tile) from anime_user;
revoke execute on function anime_app_public.all_animes_tile_user_liked(anime_app_public.all_animes_tile) from anime_user;
revoke execute on function anime_app_public.all_animes_tile_user_rating(anime_app_public.all_animes_tile) from anime_user;
revoke execute on function anime_app_public.all_animes_tile_user_episode_count(anime_app_public.all_animes_tile) from anime_user;

drop function anime_app_public.animes_user_liked(anime_app_public.animes); 
drop function anime_app_public.animes_user_watch_status(anime_app_public.animes); 
drop function anime_app_public.animes_user_rating(anime_app_public.animes); 
drop function anime_app_public.animes_user_episode_count(anime_app_public.animes); 

drop function anime_app_public.all_animes_tile_user_watch_status(anime_app_public.all_animes_tile); 
drop function anime_app_public.all_animes_tile_user_liked(anime_app_public.all_animes_tile); 
drop function anime_app_public.all_animes_tile_user_rating(anime_app_public.all_animes_tile); 
drop function anime_app_public.all_animes_tile_user_episode_count(anime_app_public.all_animes_tile); 


revoke update (user_episodes_watched) on anime_app_public.user_watch_status from anime_user;
drop policy update_user_episodes_watched on anime_app_public.user_watch_status;

alter table anime_app_public.user_watch_status drop column user_episodes_watched;

