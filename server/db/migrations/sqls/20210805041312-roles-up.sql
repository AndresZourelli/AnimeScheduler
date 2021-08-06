CREATE ROLE anime_default;
CREATE ROLE anime_user;
CREATE ROLE anime_moderator;
CREATE ROLE anime_admin; 

GRANT anime_default TO anime_user;
GRANT anime_user TO anime_moderator;
GRANT anime_moderator TO anime_admin;