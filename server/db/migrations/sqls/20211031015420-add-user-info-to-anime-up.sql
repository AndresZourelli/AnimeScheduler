alter table anime_app_public.user_watch_status add column user_episodes_watched integer not null default 0 check(user_episodes_watched >= 0 and user_episodes_watched <= 9999);

grant update (user_episodes_watched) on anime_app_public.user_watch_status to anime_user;
create policy update_user_episodes_watched on anime_app_public.user_watch_status for update to anime_user using (user_id=anime_app_public.current_user());

-- Functions for anime type
create function anime_app_public.animes_user_liked(a anime_app_public.animes) 
returns boolean as $$
select exists(select * from anime_app_public.user_anime_lists ual join anime_app_public.anime_lists al on ual.anime_list_id = al.id where al.user_id = anime_app_public.current_user() and ual.anime_id = a.id and al.title = 'default');
$$ language sql stable;

create function anime_app_public.animes_user_watch_status(a anime_app_public.animes)
returns anime_app_public.watching_status_enum as $$
select uws.watch_status from anime_app_public.user_watch_status uws where uws.user_id=anime_app_public.current_user() and uws.anime_id=a.id;
$$ language sql stable;

create function anime_app_public.animes_user_rating(a anime_app_public.animes)
returns numeric as $$
select aus.user_score from anime_app_public.anime_user_score aus where aus.user_id=anime_app_public.current_user() and aus.anime_id=a.id;
$$ language sql stable;

create function anime_app_public.animes_user_episode_count(a anime_app_public.animes)
returns numeric as $$
select uws.user_episodes_watched from anime_app_public.user_watch_status uws where uws.user_id=anime_app_public.current_user() and uws.anime_id=a.id;
$$ language sql stable;

-- Functions for view
create function anime_app_public.all_animes_tile_user_watch_status(a anime_app_public.all_animes_tile)
returns anime_app_public.watching_status_enum as $$
select uws.watch_status from anime_app_public.user_watch_status uws where uws.user_id=anime_app_public.current_user() and uws.anime_id=a.id;
$$ language sql stable;

create function anime_app_public.all_animes_tile_user_liked(a anime_app_public.all_animes_tile) 
returns boolean as $$
select exists(select * from anime_app_public.user_anime_lists ual join anime_app_public.anime_lists al on ual.anime_list_id = al.id where al.user_id = anime_app_public.current_user() and ual.anime_id = a.id and al.title = 'default');
$$ language sql stable;

create function anime_app_public.all_animes_tile_user_rating(a anime_app_public.all_animes_tile)
returns numeric as $$
select aus.user_score from anime_app_public.anime_user_score aus where aus.user_id=anime_app_public.current_user() and aus.anime_id=a.id;
$$ language sql stable;

create function anime_app_public.all_animes_tile_user_episode_count(a anime_app_public.all_animes_tile)
returns numeric as $$
select uws.user_episodes_watched from anime_app_public.user_watch_status uws where uws.user_id=anime_app_public.current_user() and uws.anime_id=a.id;
$$ language sql stable;

grant execute on function anime_app_public.animes_user_liked(anime_app_public.animes) to anime_user;
grant execute on function anime_app_public.animes_user_watch_status(anime_app_public.animes) to anime_user;
grant execute on function anime_app_public.animes_user_rating(anime_app_public.animes) to anime_user;
grant execute on function anime_app_public.animes_user_episode_count(anime_app_public.animes) to anime_user;


grant execute on function anime_app_public.all_animes_tile_user_watch_status(anime_app_public.all_animes_tile) to anime_user;
grant execute on function anime_app_public.all_animes_tile_user_liked(anime_app_public.all_animes_tile) to anime_user;
grant execute on function anime_app_public.all_animes_tile_user_rating(anime_app_public.all_animes_tile) to anime_user;
grant execute on function anime_app_public.all_animes_tile_user_episode_count(anime_app_public.all_animes_tile) to anime_user;


