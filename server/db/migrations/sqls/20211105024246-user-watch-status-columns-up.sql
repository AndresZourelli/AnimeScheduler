alter table anime_app_public.user_anime_lists add column anime_index text not null default '#';

grant update (anime_index) on anime_app_public.user_anime_lists to anime_user;

create policy update_user_anime_lists on anime_app_public.user_anime_lists for update to anime_user using (exists(select anime_app_public.current_user()));
