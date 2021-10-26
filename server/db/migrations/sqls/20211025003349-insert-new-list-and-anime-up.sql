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

grant execute on function anime_app_public.create_new_list_add_anime(uuid) to anime_user;