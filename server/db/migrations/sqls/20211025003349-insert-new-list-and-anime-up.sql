ALTER TABLE anime_app_public.anime_user_score ENABLE ROW LEVEL SECURITY;
grant select, update (user_score), insert (anime_id, user_id, user_score) on anime_app_public.anime_user_score to anime_user;


create policy select_anime_user_score on anime_app_public.anime_user_score for select to anime_user using (user_id=anime_app_public.current_user());
create policy update_anime_user_score on anime_app_public.anime_user_score for update to anime_user using (user_id=anime_app_public.current_user());
create policy insert_anime_user_score on anime_app_public.anime_user_score for insert to anime_user with check (EXISTS(select anime_app_public.current_user()));

create function anime_app_public.create_new_list_add_anime(animeIdInput uuid)
returns anime_app_public.anime_lists as $$
declare
    new_list anime_app_public.anime_lists;
begin
    insert into anime_app_public.anime_lists (user_id, title) values (anime_app_public.current_user(), 'New list') returning * into new_list;
    insert into anime_app_public.user_anime_lists(anime_list_id, anime_id) values (new_list.id, animeIdInput);
    insert into anime_app_public.user_watch_status(user_id, anime_id, watch_status) values (anime_app_public.current_user(), animeIdInput, 'Not watching') on conflict do nothing;
    return new_list;
end;
$$ language plpgsql strict security invoker;

create function anime_app_public.insert_or_update_anime_user_score(input_anime_id uuid, input_user_score integer) 
returns anime_app_public.anime_user_score
as $$
insert into anime_app_public.anime_user_score (anime_id, user_score, user_id) values (input_anime_id, input_user_score, anime_app_public.current_user()) on conflict (anime_id, user_id) do update set user_score = excluded.user_score returning *;
$$ language sql volatile strict security invoker;

grant execute on function anime_app_public.insert_or_update_anime_user_score(uuid, integer) to anime_user;
grant execute on function anime_app_public.create_new_list_add_anime(uuid) to anime_user;
