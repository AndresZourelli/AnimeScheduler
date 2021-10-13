create type anime_app_public.anime_custom_list as (
    list_id uuid,
    list_name text,
    privacy text,
    anime_id uuid,
    watching_status anime_app_public.watching_status_enum, 
    anime_title text
);

create or replace function anime_app_public.anime_in_custom_list(input_anime_id uuid)  
returns setof anime_app_public.anime_custom_list as $$
    select  al.id as list_id, al.title as list_name, al.privacy, ual.anime_id, ual.watching_status, a.title as anime_title from anime_app_public.anime_lists al 
    left join anime_app_public.user_anime_lists ual on al.id = ual.anime_list_id and ual.anime_id = input_anime_id
    left join anime_app_public.animes a on a.id = ual.anime_id 
    where al.user_id = anime_app_public.current_user();
$$ language sql stable;  