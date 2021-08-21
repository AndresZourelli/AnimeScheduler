drop view anime_app_public.all_animes_tile;
drop table anime_app_public.user_anime_lists;
drop type anime_app_public.watching_status_enum;
drop table anime_app_public.anime_lists;
drop type anime_app_public.anime_list_privacy;
drop trigger insert_default_list_trigger on anime_app_public.users;
drop function anime_app_public.insert_default_list;