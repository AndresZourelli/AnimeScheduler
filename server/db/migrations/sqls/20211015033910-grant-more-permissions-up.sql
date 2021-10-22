grant usage on schema anime_app_public to anime_default, anime_user, anime_admin;

grant select on anime_app_public.all_animes_tile to anime_default;
grant select on anime_app_public.character_by_anime to anime_default;
grant select on anime_app_public.anime_info to anime_default;
grant select on anime_app_public.character_anime_preview to anime_default;
grant select on anime_app_public.voice_actors to anime_default;
grant select on anime_app_public.animes to anime_default;

grant select on anime_app_public.age_rating_types to anime_default;
grant select on anime_app_public.airing_status_types to anime_default;
grant select on anime_app_public.alternate_anime_names to anime_default;
grant select on anime_app_public.anime_character to anime_default;
grant select on anime_app_public.anime_genre to anime_default;
grant select on anime_app_public.anime_images to anime_default;
grant select on anime_app_public.anime_licensor to anime_default;
grant select on anime_app_public.anime_producer to anime_default;
grant select on anime_app_public.anime_staff to anime_default;
grant select on anime_app_public.anime_studio to anime_default;
grant select on anime_app_public.character_images to anime_default;
grant select on anime_app_public.character_roles to anime_default;
grant select on anime_app_public.characters to anime_default;
grant select on anime_app_public.genres to anime_default;
grant select on anime_app_public.images to anime_default;
grant select on anime_app_public.languages to anime_default;
grant select on anime_app_public.licensors to anime_default;
grant select on anime_app_public.media_types to anime_default;
grant select on anime_app_public.person_images to anime_default;
grant select on anime_app_public.persons to anime_default;
grant select on anime_app_public.producers to anime_default;
grant select on anime_app_public.seasons to anime_default;
grant select on anime_app_public.source_material_types to anime_default;
grant select on anime_app_public.staff_roles to anime_default;
grant select on anime_app_public.studios to anime_default;

grant execute on function gen_random_uuid() to anime_default;
grant execute on function anime_app_public.register_user(text,  text,  text) to anime_default;

