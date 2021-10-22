create or replace view anime_app_public.all_user_animes as
select a.id, a.title, i.url, al.title as list_name, al.id as list_id, a.description,
(select 
 array_agg(g.genre) 
 from anime_app_public.genres g 
join anime_app_public.anime_genre ag on g.id = ag.genre_id
where a.id = ag.anime_id
) as genres
from anime_app_public.anime_lists al 
join anime_app_public.user_anime_lists ual on al.id = ual.anime_list_id
join anime_app_public.animes a on ual.anime_id = a.id
join anime_app_public.images i on a.profile_image_id = i.id
where al.user_id = anime_app_public.current_user();

CREATE or replace VIEW anime_app_public.all_animes_tile AS 
SELECT 
CASE
    WHEN user_anime.anime_id IS NULL THEN false
    else true
END as likes,
a.id, a.title, p.url, s.season, st.airing_status_type, a.average_watcher_rating, a.description, a.start_broadcast_datetime, a.number_of_episodes,
mt.media_type, 
(select 
 array_agg(g.genre) 
 from anime_app_public.genres g 
join anime_app_public.anime_genre ag on g.id = ag.genre_id
where a.id = ag.anime_id
) as genres,
(select 
 array_agg(s.studio) 
 from anime_app_public.studios s 
join anime_app_public.anime_studio ats on s.id = ats.studio_id
where a.id = ats.anime_id
) as studios
FROM anime_app_public.animes a
JOIN anime_app_public.airing_status_types st 
ON a.airing_status_id = st.id JOIN anime_app_public.seasons s 
ON a.season_id = s.id JOIN anime_app_public.images p
ON a.profile_image_id = p.id
join anime_app_public.media_types mt on a.media_type_id=mt.id
LEFT JOIN (
    select distinct on (ual.anime_id) al.title, ual.anime_id, al.title, al.id as anime_list  from anime_app_public.user_anime_lists ual JOIN anime_app_public.anime_lists al on ual.anime_list_id = al.id where al.user_id = anime_app_public.current_user()
) as user_anime on a.id = user_anime.anime_id
ORDER BY a.average_watcher_rating DESC;