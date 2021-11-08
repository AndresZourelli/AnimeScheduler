revoke update on anime_app_public.user_anime_lists from anime_user;
drop policy update_user_anime_lists on anime_app_public.user_anime_lists;

alter table anime_app_public.user_anime_lists drop column anime_index;