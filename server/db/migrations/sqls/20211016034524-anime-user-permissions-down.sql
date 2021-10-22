revoke select, insert,update, delete on anime_app_public.users from anime_user; 
revoke ALL privileges on anime_app_public.anime_lists from anime_user; 
revoke ALL privileges on anime_app_public.user_anime_lists from anime_user; 
revoke ALL privileges on anime_app_public.user_watch_status from anime_user; 
revoke execute on function anime_app_public.current_user() from anime_user;
revoke execute on function anime_app_public.add_anime_to_list( text,  uuid,  text,  anime_app_public.anime_list_privacy,  anime_app_public.watching_status_enum) from anime_user;

drop policy insert_to_anime_list  on anime_app_public.anime_lists;
drop policy insert_to_user_watch_status  on anime_app_public.user_watch_status;
drop policy insert_to_user_anime_lists  on anime_app_public.user_anime_lists;

drop policy select_to_anime_list on anime_app_public.anime_lists;

drop function anime_app_public.add_anime_to_list( text,  uuid,  text,  anime_app_public.anime_list_privacy,  anime_app_public.watching_status_enum);