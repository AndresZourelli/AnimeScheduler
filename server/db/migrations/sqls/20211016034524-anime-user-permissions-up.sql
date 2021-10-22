create function anime_app_public.add_anime_to_list(user_id text, anime_id uuid, title text, privacy anime_app_public.anime_list_privacy default 'Public', watch_status anime_app_public.watching_status_enum default 'Plan to watch')
returns anime_app_public.anime_lists as $$
declare 
    anime_list anime_app_public.anime_lists;
begin
    insert into anime_app_public.anime_lists (user_id, title, privacy) values (user_id, title, privacy) returning * into anime_list;
    insert into anime_app_public.user_anime_lists (anime_list_id, anime_id) values (anime_list.id, anime_id);
    insert into anime_app_public.user_watch_status (user_id, anime_id, watch_status) values (user_id, anime_id, watch_status) on conflict do nothing;
return anime_list;
end;
$$ language plpgsql SECURITY INVOKER;

grant select, update, delete on anime_app_public.users to anime_user; 
grant ALL privileges on anime_app_public.anime_lists to anime_user; 
grant ALL privileges on anime_app_public.user_anime_lists to anime_user; 
grant ALL privileges on anime_app_public.user_watch_status to anime_user; 
grant execute on function anime_app_public.current_user() to anime_user;
grant execute on function anime_app_public.add_anime_to_list( text,  uuid,  text,  anime_app_public.anime_list_privacy,  anime_app_public.watching_status_enum) to anime_user;

create policy insert_to_user_watch_status on anime_app_public.user_watch_status for insert to anime_user with check ("user_id" = anime_app_public.current_user());
create policy insert_to_anime_list on anime_app_public.anime_lists for insert to anime_user with check(exists(select 1 from anime_app_public.users u where u.id = anime_app_public.current_user()));
create policy insert_to_user_anime_lists on anime_app_public.user_anime_lists for insert to anime_user with check (exists(select anime_app_public.current_user()));

create policy select_to_anime_list on anime_app_public.anime_lists for select to anime_user using ("user_id" = anime_app_public.current_user());
