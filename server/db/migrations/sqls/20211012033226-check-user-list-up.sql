create table anime_app_public.user_watch_status(
    user_id text references anime_app_public.users(id) ON DELETE CASCADE NOT NULL,
    anime_id uuid references anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    watch_status anime_app_public.watching_status_enum default 'Watching' NOT NULL,
    primary key (user_id, anime_id)
);

-- alter table anime_app_public.user_anime_lists drop column watching_status;
