REVOKE anime_moderator FROM anime_admin;
REVOKE anime_user FROM anime_moderator;
REVOKE anime_default FROM anime_user;

DROP ROLE anime_admin; 
DROP ROLE anime_moderator;
DROP ROLE anime_user;
DROP ROLE anime_default;