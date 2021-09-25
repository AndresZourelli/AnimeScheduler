create type anime_app_public.anime_list_privacy as enum (
    'Public',
    'Private',
    'Friends Only'
);

create table anime_app_public.anime_lists (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id text references anime_app_public.users(id) ON DELETE CASCADE NOT NULL,
    title text not null default 'default',
    privacy anime_app_public.anime_list_privacy not null default 'Public',
    unique(user_id, title)
);

create type anime_app_public.watching_status_enum as enum (
    'Watching',
    'Plan to watch',
    'Completed',
    'Rewatching',
    'Paused', 
    'Dropped'
);


create table anime_app_public.user_anime_lists (
    anime_list_id uuid references anime_app_public.anime_lists(id) ON DELETE CASCADE NOT NULL,
    anime_id uuid references anime_app_public.animes(id) ON DELETE CASCADE NOT NULL,
    watching_status anime_app_public.watching_status_enum not null default 'Watching',
    unique(anime_list_id, anime_id)
);

create function anime_app_public.insert_default_list()
returns trigger as $$
begin
    insert into anime_app_public.anime_lists (user_id) values (new.id);
    return new;
end;
$$
language plpgsql;

create trigger insert_default_list_trigger after insert on anime_app_public.users
for each row execute procedure anime_app_public.insert_default_list();

create or replace view anime_app_public.all_animes_tile as
SELECT 
CASE
    WHEN user_anime.anime_id IS NULL THEN false
    else true
END as likes,
a.id, a.title, p.url, s.season, st.airing_status_type, a.average_watcher_rating, a.start_broadcast_datetime
FROM anime_app_public.animes a
JOIN anime_app_public.airing_status_types st 
ON a.airing_status_id = st.id JOIN anime_app_public.seasons s 
ON a.season_id = s.id JOIN anime_app_public.images p
ON a.profile_image_id = p.id
LEFT JOIN (
    select distinct on (ual.anime_id) al.title, ual.anime_id, ual.watching_status, al.title, al.id as anime_list  from anime_app_public.user_anime_lists ual JOIN anime_app_public.anime_lists al on ual.anime_list_id = al.id where al.user_id = anime_app_public.current_user()
) as user_anime on a.id = user_anime.anime_id
ORDER BY a.average_watcher_rating DESC;
