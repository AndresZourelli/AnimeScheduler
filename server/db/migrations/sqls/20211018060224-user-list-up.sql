create type anime_app_public.user_list_anime as (
    title text,
    id uuid,
    watch_status anime_app_public.watching_status_enum,
    url text
    average_watcher_rating numeric
);

create type anime_app_public.user_list as (
    id uuid,
    title text,
    user_id text,
    animes anime_app_public.user_list_anime[]
);

create function anime_app_public.get_user_anime_lists(watch_status_input anime_app_public.watching_status_enum default NULL) returns setof anime_app_public.user_list as
$$
select  al.id, al.title, al.user_id, coalesce((array_agg(anime_list::anime_app_public.user_list_anime) filter (where anime_list.title is not null)), '{}') as animes from anime_app_public.anime_lists al 
left join anime_app_public.user_anime_lists ual on al.id = ual.anime_list_id 
left join (select a.title, a.id, uws.watch_status, i.url from anime_app_public.user_watch_status uws left join anime_app_public.animes a on uws.anime_id = a.id left join anime_app_public.images i on a.profile_image_id = i.id where (watch_status_input is null or uws.watch_status = watch_status_input)) anime_list on ual.anime_id = anime_list.id
group by al.id;
$$
language sql stable;

-- create function get_user_anime_lists() returns json as
-- $$
-- select json_build_object('id', al.id, 'title', al.title, 'user', al.user_id, 'animes', coalesce(jsonb_agg(anime_list) filter (where anime_list.title is not null), '[]')) from anime_app_public.anime_lists al 
-- left join anime_app_public.user_anime_lists ual on al.id = ual.anime_list_id 
-- left join (select a.title, a.id as anime_id, uws.watch_status, i.url from anime_app_public.user_watch_status uws left join anime_app_public.animes a on uws.anime_id = a.id left join anime_app_public.images i on a.profile_image_id = i.id) anime_list on ual.anime_id = anime_list.anime_id
-- group by al.id;
-- $$
-- language sql stable;