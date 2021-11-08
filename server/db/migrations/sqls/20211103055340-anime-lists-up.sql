create type anime_app_public.custom_anime_list as (
    id text,
    list_name text,
    title text,
    watch_status anime_app_public.watching_status_enum,
    user_episodes_watched integer,
    number_of_episodes integer,
    user_score numeric,
    media_type text,
    anime_id uuid,
    image_url text,
    average_watcher_rating numeric
);

create function anime_app_public.user_custom_anime_list(list_id uuid)
returns setof anime_app_public.custom_anime_list as $$
    select al.id::text|| '-' || a.id::text as id, al.title as list_name, a.title, uws.watch_status, uws.user_episodes_watched, a.number_of_episodes, 
    aus.user_score, mt.media_type, ual.anime_id, i.url as image_url, a.average_watcher_rating
    from anime_app_public.user_anime_lists ual join anime_app_public.anime_lists al on ual.anime_list_id = al.id 
    join anime_app_public.user_watch_status uws on ual.anime_id = uws.anime_id 
    join anime_app_public.animes a on ual.anime_id = a.id 
    join anime_app_public.images i on a.profile_image_id = i.id  
    join anime_app_public.anime_user_score aus on ual.anime_id = aus.anime_id 
    join anime_app_public.media_types mt on a.media_type_id = mt.id
    where ual.anime_list_id = list_id; 
$$ language sql stable;

grant execute on function anime_app_public.user_custom_anime_list(uuid) to anime_user;