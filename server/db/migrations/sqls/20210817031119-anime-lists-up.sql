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