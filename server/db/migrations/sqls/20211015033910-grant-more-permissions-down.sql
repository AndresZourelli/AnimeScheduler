revoke usage on schema anime_app_public from anime_default, anime_user, anime_admin;

revoke select on anime_app_public.all_animes_tile from anime_default;
revoke select on anime_app_public.character_by_anime from anime_default;
revoke select on anime_app_public.anime_info from anime_default;
revoke select on anime_app_public.character_anime_preview from anime_default;
revoke select on anime_app_public.voice_actors from anime_default;
revoke select on anime_app_public.animes from anime_default;

revoke select on anime_app_public.age_rating_types from anime_default;
revoke select on anime_app_public.airing_status_types from anime_default;
revoke select on anime_app_public.alternate_anime_names from anime_default;
revoke select on anime_app_public.anime_character from anime_default;
revoke select on anime_app_public.anime_genre from anime_default;
revoke select on anime_app_public.anime_images from anime_default;
revoke select on anime_app_public.anime_licensor from anime_default;
revoke select on anime_app_public.anime_producer from anime_default;
revoke select on anime_app_public.anime_staff from anime_default;
revoke select on anime_app_public.anime_studio from anime_default;
revoke select on anime_app_public.character_images from anime_default;
revoke select on anime_app_public.character_roles from anime_default;
revoke select on anime_app_public.characters from anime_default;
revoke select on anime_app_public.genres from anime_default;
revoke select on anime_app_public.images from anime_default;
revoke select on anime_app_public.languages from anime_default;
revoke select on anime_app_public.licensors from anime_default;
revoke select on anime_app_public.media_types from anime_default;
revoke select on anime_app_public.person_images from anime_default;
revoke select on anime_app_public.persons from anime_default;
revoke select on anime_app_public.producers from anime_default;
revoke select on anime_app_public.seasons from anime_default;
revoke select on anime_app_public.source_material_types from anime_default;
revoke select on anime_app_public.staff_roles from anime_default;
revoke select on anime_app_public.studios from anime_default;

revoke execute on function gen_random_uuid() from anime_default;
revoke execute on function anime_app_public.register_user( text,  text,  text) from anime_default;