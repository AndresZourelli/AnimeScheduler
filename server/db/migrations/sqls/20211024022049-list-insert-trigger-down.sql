revoke execute on function anime_app_public.insert_anime_to_user_list( uuid,  uuid, anime_app_public.watching_status_enum) from anime_user;
revoke delete, select, insert on anime_app_public.user_anime_lists from anime_user;

drop policy delete_anime_from_list on anime_app_public.user_anime_lists;
drop policy select_anime_from_list on anime_app_public.user_anime_lists;
drop policy insert_anime_from_list on anime_app_public.user_anime_lists;

drop function anime_app_public.insert_anime_to_user_list( uuid,  uuid,  anime_app_public.watching_status_enum);
