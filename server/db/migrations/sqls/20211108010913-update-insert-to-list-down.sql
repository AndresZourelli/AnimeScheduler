revoke execute on function anime_app_public.insert_anime_to_user_list(uuid, uuid,text, anime_app_public.watching_status_enum) from anime_user;
drop function anime_app_public.insert_anime_to_user_list(uuid, uuid, text, anime_app_public.watching_status_enum);

revoke execute on function anime_app_public.user_custom_anime_list(uuid) from anime_user;
drop function if exists anime_app_public.user_custom_anime_list(list_id uuid);
drop type if exists anime_app_public.custom_anime_list;