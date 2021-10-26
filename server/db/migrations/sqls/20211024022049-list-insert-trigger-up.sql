grant select, delete, insert on anime_app_public.user_anime_lists to anime_user;

create policy delete_anime_from_list on anime_app_public.user_anime_lists for delete to anime_user using (EXISTS(select anime_app_public.current_user()));
create policy select_anime_from_list on anime_app_public.user_anime_lists for select to anime_user using (EXISTS(select anime_app_public.current_user()));
create policy insert_anime_from_list on anime_app_public.user_anime_lists for insert to anime_user with check (EXISTS(select anime_app_public.current_user()));

create function anime_app_public.insert_anime_to_user_list(anime_id uuid, anime_list_id uuid, watch_status anime_app_public.watching_status_enum default 'Not watching') 
returns anime_app_public.user_anime_lists as $$
declare 
    results anime_app_public.user_anime_lists;
begin 
    insert into anime_app_public.user_anime_lists(anime_id, anime_list_id) values (anime_id, anime_list_id) returning * into results;
    insert into anime_app_public.user_watch_status(user_id, anime_id, watch_status) values ((select anime_app_public.current_user()), anime_id, watch_status) on conflict do nothing;
    return results;
end;
$$
language plpgsql security invoker;

grant execute on function anime_app_public.insert_anime_to_user_list( uuid,  uuid, anime_app_public.watching_status_enum) to anime_user;