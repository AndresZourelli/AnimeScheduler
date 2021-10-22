grant update (watch_status) on anime_app_public.user_watch_status to anime_user;
grant insert (anime_list_id, anime_id) on anime_app_public.user_anime_lists to anime_user;
grant insert (user_id, title, privacy) on anime_app_public.anime_lists to anime_user;

create policy update_user_watch_statuses on anime_app_public.user_watch_status for update to anime_user using (user_id=anime_app_public.current_user());
create policy insert_user_anime_lists on anime_app_public.user_anime_lists for insert to anime_user with check (EXISTS(select anime_app_public.current_user()));
create policy insert_anime_lists on anime_app_public.anime_lists for insert to anime_user with check (EXISTS(select anime_app_public.current_user()));

