CREATE VIEW anime_app_public.all_animes_tile AS 
SELECT 
CASE
    WHEN ua.anime_id IS NULL THEN false
    else true
END as likes,
a.id, a.title, p.url, s.season, st.airing_status_type, a.average_watcher_rating
FROM anime_app_public.animes a
JOIN anime_app_public.airing_status_types st 
ON a.airing_status_id = st.id JOIN anime_app_public.seasons s 
ON a.season_id = s.id JOIN anime_app_public.images p
ON a.profile_image_id = p.id
LEFT JOIN anime_app_public.user_anime ua
ON a.id = ua.anime_id AND ua.user_id = anime_app_public.current_user()
ORDER BY a.average_watcher_rating DESC;

CREATE VIEW anime_app_public.character_by_anime AS 
SELECT ac.anime_id, c.name as character_name, i.url AS character_image, ac.character_id, p.first_name AS actor_first_name, 
p.last_name AS actor_last_name, ac.person_id AS actor_id, i2.url AS actor_image, cr.role, l.language  
FROM anime_app_public.anime_character ac 
LEFT JOIN anime_app_public.characters c ON ac.character_id = c.id
LEFT JOIN anime_app_public.images i ON c.character_image_id = i.id
LEFT JOIN anime_app_public.persons p ON ac.person_id = p.id
LEFT JOIN anime_app_public.images i2 ON p.person_image_id = i2.id
LEFT JOIN anime_app_public.character_roles cr ON ac.character_role_id = cr.id
LEFT JOIN anime_app_public.languages l ON ac.language_id = l.id;

CREATE VIEW anime_app_public.anime_info AS 
SELECT a.id, a.mal_id, a.title, a.description, a.number_of_episodes,
a.duration, a.average_watcher_rating, a.start_broadcast_datetime, a.end_broadcast_datetime, 
i.url AS anime_profile_image, ast.airing_status_type AS airing_status, mt.media_type, s.season, sm.source_material_type, art.age_rating_type AS age_rating
FROM anime_app_public.animes a
LEFT JOIN anime_app_public.age_rating_types art ON a.age_rating_id = art.id
LEFT JOIN anime_app_public.media_types mt ON a.media_type_id = mt.id
LEFT JOIN anime_app_public.seasons s ON a.season_id = s.id
LEFT JOIN anime_app_public.source_material_types sm ON a.source_material_id = sm.id
LEFT JOIN anime_app_public.age_rating_types ar ON a.age_rating_id = ar.id
LEFT JOIN anime_app_public.images i ON a.profile_image_id = i.id
LEFT JOIN anime_app_public.airing_status_types ast ON a.airing_status_id = ast.id;

create type anime_app_public.staff_result as (
    anime_id text,
    character_id text,
    character_name text,
    character_image text,
    actor_first_name text,
    actor_last_name text,
    person_id text, 
    actor_image text,
    character_role text,
    language text
);

CREATE FUNCTION anime_app_public.animes_character_preview(a anime_app_public.animes)
returns setof anime_app_public.staff_result as $$
select ac.anime_id, c.id as character_id, c."name" as character_name, i.url as character_image, p.first_name as actor_first_name, 
ac.person_id, p.last_name as actor_last_name, i2.url as actor_image, cr."role" as character_role, l."language" 
from anime_app_public.anime_character ac 
join anime_app_public."characters" c on ac.character_id = c.id 
join anime_app_public.images i on c.character_image_id = i.id 
join anime_app_public.persons p on ac.person_id = p.id 
join anime_app_public.images i2 on p.person_image_id = i2.id 
join anime_app_public.character_roles cr on ac.character_role_id = cr.id 
join anime_app_public.languages l on ac.language_id = l.id 
where ac.anime_id = a.id;
$$
language sql stable;

CREATE VIEW anime_app_public.character_anime_preview AS 
select distinct on (ac.character_id, ac.anime_id) ac.character_id, ac.anime_id, i.url as anime_image_url, i2.url as character_image_url, a.title  from anime_app_public.anime_character ac 
join anime_app_public.animes a on ac.anime_id = a.id
join anime_app_public.images i on a.profile_image_id = i.id
join anime_app_public.characters c on ac.character_id = c.id
join anime_app_public.images i2 on c.character_image_id = i2.id;

comment on view anime_app_public.character_anime_preview is E'@foreignKey (character_id) references anime_app_public.characters (id)';

create view anime_app_public.voice_actors as 
select distinct on (ac.person_id) ac.character_id, p.first_name as actor_first_name, p.last_name as actor_last_name, 
i.url as person_image_url, l.language, ac.person_id as voice_actor_id
from anime_app_public.anime_character ac 
join anime_app_public.persons p on ac.person_id = p.id
join anime_app_public.images i on p.person_image_id = i.id
join anime_app_public.languages l on ac.language_id = l.id;

comment on view anime_app_public.voice_actors is E'@foreignKey (character_id) references anime_app_public.characters (id)';

