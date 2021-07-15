# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from animeScraper.items import ActorItem, StaffItem, CharacterItem, AnimeItem
import json
from scrapy.exceptions import DropItem  
from dotenv import load_dotenv
import os
import logging
import psycopg2 
import datetime
import time
load_dotenv()

DB = os.getenv("DB")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

db_conn = psycopg2.connect(database=DB, user=DB_USER, password=DB_PASSWORD, host="localhost", port="5433")

class ActorsPipeline:
    def __init__(self): 
        self.actors_seen = set() 
        with open('Actors.json',"w") as json_file:
                json.dump({"data":[]},json_file)

    def process_item(self, item, spider):
        if item is None:
            return item

        if isinstance(item, ActorItem):
            logging.critical(f"---Actor Pipeline--- \n\r Actor: {item['name']}")
            if (item['name'], item["anime"]) in self.actors_seen:
                raise DropItem("Repeated Actors found: %s" % item)
            else:
                self.actors_seen.add((item['name'], item["anime"]))
                self.insert_db(ItemAdapter(item).asdict())
                 
                return item
        return item
    
    def insert_db(self, data):
        try: 
            db_cur = db_conn.cursor()
            actor_sql_query = """
                WITH ins1 AS (
                        INSERT INTO images (image_name, image_url) VALUES (%s, %s) RETURNING image_id
                    ),
                cte AS (
                    INSERT INTO actors (mal_actor_id, actor_name, fk_actor_primary_image) VALUES 
                    (%s, %s, (SELECT image_id FROM ins1)) 
                    ON CONFLICT DO NOTHING
                    RETURNING actor_id
                ),
                ins2 AS (
                    SELECT actor_id FROM cte WHERE EXISTS (SELECT 1 FROM cte)
                    UNION ALL
                    SELECT actor_id FROM actors WHERE mal_actor_id=%s AND NOT EXISTS (SELECT 1 FROM cte)
                ),
                ins3 AS (
                    INSERT INTO languages (language_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING language_id
                ),
                ins4 AS (
                    SELECT language_id FROM ins3 WHERE EXISTS (SELECT 1 FROM ins3)
                    UNION ALL
                    SELECT language_id FROM languages WHERE language_name=%s AND NOT EXISTS (SELECT 1 FROM ins3)
                ),
                ins5 AS (
                    INSERT INTO character_actors (fk_character_id, fk_actor_id, fk_language_id) VALUES (
                        (SELECT character_id FROM characters WHERE mal_character_id=%s), 
                        (SELECT actor_id FROM ins2), 
                        (SELECT language_id FROM ins4)) ON CONFLICT DO NOTHING
                )
                INSERT INTO anime_actor (fk_anime_id, fk_actor_id, fk_language_id) VALUES (
                    (SELECT anime_id FROM animes WHERE mal_anime_id=%s), (SELECT actor_id FROM ins2), (SELECT language_id FROM ins4)
                ) ON CONFLICT DO NOTHING
            """
            db_cur.execute(actor_sql_query, (data["name"], data["image_url"], data["actor_mal_id"], 
                data["name"], data["actor_mal_id"], data["actor_language"], data["actor_language"], data["character_mal_id"], data["anime_mal_id"]))
            db_conn.commit()
        except psycopg2.InternalError as e:
            db_conn.rollback()
            logging.critical(e)
        db_cur.close()

            

class StaffPipeline:
    def __init__(self): 
        self.staff_seen = set()
        with open('Staff.json',"w") as json_file:
            json.dump({"data":[]},json_file) 

    def process_item(self, item, spider):
        if item is None:
            return item

        if isinstance(item, StaffItem):
            logging.critical(f"---Staff Pipeline--- \n\r Staff: {item['name']}")
            if (item['name'], item["anime"]) in self.staff_seen:
                raise DropItem("Repeated Staff found: %s" % item)
            else:
                self.staff_seen.add((item['name'], item["anime"]))
                self.insert_db(ItemAdapter(item).asdict())
                 
                return item
        return item
    
    def insert_db(self, data):
        try:
            db_cur = db_conn.cursor()
            character_sql_query = """
                WITH ins1 AS (
                    INSERT INTO images (image_name, image_url) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING image_id
                ),
                ins2 AS (
                    SELECT image_id FROM ins1 WHERE EXISTS (SELECT 1 FROM ins1)
                    UNION ALL
                    SELECT image_id FROM images WHERE image_name=%s AND NOT EXISTS (SELECT 1 FROM ins1)
                ),
                ins3 AS (    
                    INSERT INTO staff (mal_staff_id, staff_name) VALUES (%s, %s) 
                    ON CONFLICT DO NOTHING
                    RETURNING staff_id
                ),
                ins8 AS (
                    SELECT staff_id FROM ins3 WHERE EXISTS (SELECT 1 FROM ins3)
                    UNION ALL
                    SELECT staff_id FROM staff WHERE mal_staff_id=%s AND NOT EXISTS (SELECT 1 FROM ins3)
                ),
                ins4 AS (
                    INSERT INTO staff_images (fk_staff_id, fk_image_id) VALUES ((SELECT staff_id FROM ins8), (SELECT image_id FROM ins2)) RETURNING staff_image_id
                ),
                ins5 AS (
                    UPDATE staff SET fk_staff_primary_image=(SELECT staff_image_id FROM ins4) WHERE mal_staff_id=%s AND fk_staff_primary_image IS NULL
                ),
                ins6 AS (
                    INSERT INTO staff_roles (staff_role_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING staff_role_id
                ),
                ins7 AS (
                    SELECT staff_role_id FROM ins6 WHERE EXISTS (SELECT 1 FROM ins6)
                    UNION ALL
                    SELECT staff_role_id FROM staff_roles WHERE staff_role_name=%s AND NOT EXISTS (SELECT 1 FROM ins6)
                )
                INSERT INTO anime_staff (fk_anime_id, fk_staff_id, fk_staff_role_id) 
                    VALUES ((SELECT anime_id FROM animes WHERE mal_anime_id=%s ), (SELECT staff_id FROM ins8), (SELECT staff_role_id FROM ins7))
                        ON CONFLICT DO NOTHING
            """
            db_cur.execute(character_sql_query, (data["name"], data["image_url"], data["name"], data["staff_mal_id"], data["name"], 
                data["staff_mal_id"], data["staff_mal_id"], data["role"], data["role"], data["anime_mal_id"]))
            db_conn.commit()
        except psycopg2.InternalError as e:
            db_conn.rollback()
            logging.critical(e)
        db_cur.close()

class CharacterPipeline:
    def __init__(self): 
        self.characters_seen = set()
        with open('Characters.json',"w") as json_file:
            json.dump({"data":[]},json_file)

    def process_item(self, item, spider):
        if item is None:
            return item
        if isinstance(item, CharacterItem):
            logging.critical(f"---Character Pipeline--- \n\r Character: {item['name']}")
            if (item['name'], item["anime"]) in self.characters_seen:
                raise DropItem("Repeated Characters found: %s" % item)
            else:
                self.characters_seen.add((item['name'], item["anime"]))
                self.insert_db(ItemAdapter(item).asdict())
                 
                return item
        return item

    def insert_db(self, data):
        try:
            db_cur = db_conn.cursor()
            character_sql_query = """
                WITH ins1 AS (
                    INSERT INTO images (image_name, image_url) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING image_id
                ),
                ins2 AS (
                    SELECT image_id FROM ins1 WHERE EXISTS (SELECT 1 FROM ins1)
                    UNION ALL
                    SELECT image_id FROM images WHERE image_name=%s AND NOT EXISTS (SELECT 1 FROM ins1)
                ),
                ins3 AS (    
                    INSERT INTO characters (mal_character_id, character_name) VALUES (%s, %s) 
                    ON CONFLICT DO NOTHING
                    RETURNING character_id
                ),
                ins8 AS (
                    SELECT character_id FROM ins3 WHERE EXISTS (SELECT 1 FROM ins3)
                    UNION ALL
                    SELECT character_id FROM characters WHERE mal_character_id=%s AND NOT EXISTS (SELECT 1 FROM ins3)
                ),
                ins4 AS (
                    INSERT INTO character_images (fk_character_id, fk_image_id) VALUES ((SELECT character_id FROM ins8), (SELECT image_id FROM ins2)) RETURNING character_image_id
                ),
                ins5 AS (
                    UPDATE characters SET fk_character_primary_image=(SELECT character_image_id FROM ins4) WHERE mal_character_id=%s
                ),
                ins6 AS (
                    INSERT INTO character_roles (character_role_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING character_role_id
                ),
                ins7 AS (
                    SELECT character_role_id FROM ins6 WHERE EXISTS (SELECT 1 FROM ins6)
                    UNION ALL
                    SELECT character_role_id FROM character_roles WHERE character_role_name=%s AND NOT EXISTS (SELECT 1 FROM ins6)
                )
                INSERT INTO anime_character (fk_anime_id, fk_character_id, fk_character_role_id) 
                    VALUES ((SELECT anime_id FROM animes WHERE mal_anime_id=%s ), (SELECT character_id FROM ins8), (SELECT character_role_id FROM ins7))
                        ON CONFLICT DO NOTHING
            """
            logging.critical((data["name"], data["image_url"], data["name"], data["character_mal_id"], data["name"], 
                data["character_mal_id"], data["character_mal_id"], data["role"], data["role"], data["anime_mal_id"]))
            db_cur.execute(character_sql_query, (data["name"], data["image_url"], data["name"], data["character_mal_id"], data["name"], 
                data["character_mal_id"], data["character_mal_id"], data["role"], data["role"], data["anime_mal_id"]))
            db_conn.commit()

        except psycopg2.InternalError as e:
            db_conn.rollback()
            logging.critical(e)

        db_cur.close()
        

class AnimePipeline:
    def __init__(self): 
        self.animes_seen = set()
        with open('Animes.json',"w") as json_file:
            json.dump({"data":[]},json_file)

    def process_item(self, item, spider):
        if item is None:
            return item
        if isinstance(item, AnimeItem):
            logging.critical(f"---Anime Pipeline--- \n\r Anime: {item['title']}")
            if (item['title']) in self.animes_seen:
                raise DropItem("Repeated Animes found: %s" % item)
            else:
                self.animes_seen.add(item['title'])

                if "season" not in item:
                    item["season"] = "None"

                if "aired_end" not in item:
                    item["aired_end"] = None

                self.insert_db(ItemAdapter(item).asdict())
                 
                # self.write_json(dict(item))
                return item
        return item

    def insert_db(self, data):
        try:
            db_cur = db_conn.cursor()
            anime_sql_query = """
            WITH air_status_insert AS (
                INSERT INTO airing_status_types (airing_status_type_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING airing_status_type_id
            ),
            air_status_select AS (
                SELECT airing_status_type_id FROM air_status_insert WHERE EXISTS (SELECT 1 FROM air_status_insert)
                UNION ALL
                SELECT airing_status_type_id FROM airing_status_types WHERE airing_status_type_name=%s AND NOT EXISTS (SELECT 1 FROM air_status_insert)
            ),
            media_type_insert AS (
                INSERT INTO media_types (media_type_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING media_type_id
            ),
            media_type_select AS (
                SELECT media_type_id FROM media_type_insert WHERE EXISTS (SELECT 1 FROM media_type_insert)
                UNION ALL
                SELECT media_type_id FROM media_types WHERE media_type_name=%s AND NOT EXISTS (SELECT 1 FROM media_type_insert)
            ),
            season_insert AS (
                INSERT INTO seasons (season_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING season_id
            ),
            season_select AS (
                SELECT season_id FROM season_insert WHERE EXISTS (SELECT 1 FROM season_insert)
                UNION ALL
                SELECT season_id FROM seasons WHERE season_name=%s AND NOT EXISTS (SELECT 1 FROM season_insert)
            ),
            source_material_insert AS (
                INSERT INTO source_material_types (source_material_type_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING source_material_type_id
            ),
            source_material_select AS (
                SELECT source_material_type_id FROM source_material_insert WHERE EXISTS (SELECT 1 FROM source_material_insert)
                UNION ALL
                SELECT source_material_type_id FROM source_material_types WHERE source_material_type_name=%s AND NOT EXISTS (SELECT 1 FROM source_material_insert)
            )
            INSERT INTO animes 
            (mal_anime_id, 
            anime_title, 
            anime_description, 
            number_of_episodes, 
            fk_airing_status_type_id,
            fk_media_type_id,
            start_broadcast_datetime,
            end_broadcast_datetime,
            fk_season_id,
            fk_source_material_id,
            duration,
            primary_image_url,
            average_rating
            ) VALUES (
                %s, 
                %s,
                %s,
                %s,
                (SELECT airing_status_type_id FROM air_status_select),
                (SELECT media_type_id FROM  media_type_select),
                %s,
                %s,
                (SELECT season_id FROM season_select),
                (SELECT source_material_type_id FROM source_material_select),
                %s,
                %s,
                %s
            ) ON CONFLICT DO NOTHING
            """
            variables = (
                data["status"], data["status"], data["type"], data["type"],
                data["season"], data["season"], data["source"], data["source"], 
                data["anime_mal_id"], data["title"], data["description"], data["episodes"],
                data["aired_start"], data["aired_end"], data["duration"], data["image_url"],
                data["avg_score"]
            ) 
            db_cur.execute(anime_sql_query, variables)
            
            images_sql_query = """
            WITH image_insert AS (
                INSERT INTO images (image_name, image_url) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING image_id
            ),
            image_select AS (
                SELECT image_id FROM image_insert WHERE EXISTS (SELECT 1 FROM image_insert)
                UNION ALL
                SELECT image_id FROM images WHERE image_url=%s AND NOT EXISTS (SELECT 1 FROM image_insert)
            )
            INSERT INTO anime_images (fk_anime_id, fk_image_id) VALUES ((SELECT anime_id FROM animes WHERE mal_anime_id=%s), (SELECT image_id FROM image_select))
            """
            db_cur.execute(images_sql_query, (data["title"], data["image_url"], data["image_url"], data["anime_mal_id"]))

            producers_sql_query = """
            WITH producers_insert AS (
                INSERT INTO producers (producer_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING producer_id
            ),
            producers_select AS (
                SELECT producer_id FROM producers_insert WHERE EXISTS (SELECT 1 FROM producers_insert)
                UNION ALL
                SELECT producer_id FROM producers WHERE producer_name=%s AND NOT EXISTS (SELECT 1 FROM producers_insert)
            ) 
            INSERT INTO anime_producer (fk_anime_id, fk_producer_id) VALUES ((SELECT anime_id FROM animes WHERE mal_anime_id=%s ), (SELECT producer_id FROM producers_select)) ON CONFLICT DO NOTHING
            """

            for producer_name in data["producers"]:
                db_cur.execute(producers_sql_query, (producer_name, producer_name, data["anime_mal_id"]))

            licensors_sql_query = """
            WITH licensors_insert AS (
                INSERT INTO licensors (licensor_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING licensor_id
            ),
            licensors_select AS (
                SELECT licensor_id FROM licensors_insert WHERE EXISTS (SELECT 1 FROM licensors_insert)
                UNION ALL
                SELECT licensor_id FROM licensors WHERE licensor_name=%s AND NOT EXISTS (SELECT 1 FROM licensors_insert)
            ) 
            INSERT INTO anime_licensor (fk_anime_id, fk_licensor_id) VALUES ((SELECT anime_id FROM animes WHERE mal_anime_id=%s ), (SELECT licensor_id FROM licensors_select)) ON CONFLICT DO NOTHING
            """

            for licensor_name in data["licensors"]:
                db_cur.execute(licensors_sql_query, (licensor_name, licensor_name, data["anime_mal_id"]))

            studios_sql_query = """
            WITH studios_insert AS (
                INSERT INTO studios (studio_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING studio_id
            ),
            studios_select AS (
                SELECT studio_id FROM studios_insert WHERE EXISTS (SELECT 1 FROM studios_insert)
                UNION ALL
                SELECT studio_id FROM studios WHERE studio_name=%s AND NOT EXISTS (SELECT 1 FROM studios_insert)
            ) 
            INSERT INTO anime_studio (fk_anime_id, fk_studio_id) VALUES ((SELECT anime_id FROM animes WHERE mal_anime_id=%s ), (SELECT studio_id FROM studios_select)) ON CONFLICT DO NOTHING
            """

            for studio_name in data["studios"]:
                db_cur.execute(studios_sql_query, (studio_name, studio_name, data["anime_mal_id"]))

            genres_sql_query = """
            WITH genres_insert AS (
                INSERT INTO genres (genre_name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING genre_id
            ),
            genres_select AS (
                SELECT genre_id FROM genres_insert WHERE EXISTS (SELECT 1 FROM genres_insert)
                UNION ALL
                SELECT genre_id FROM genres WHERE genre_name=%s AND NOT EXISTS (SELECT 1 FROM genres_insert)
            ) 
            INSERT INTO anime_genre (fk_anime_id, fk_genre_id) VALUES ((SELECT anime_id FROM animes WHERE mal_anime_id=%s ), (SELECT genre_id FROM genres_select)) ON CONFLICT DO NOTHING
            """

            for genre_name in data["genres"]:
                db_cur.execute(genres_sql_query, (genre_name, genre_name, data["anime_mal_id"]))

            alt_names_sql_query = """
            WITH alt_name_types_insert AS (
                INSERT INTO alt_name_types (alt_name_type) VALUES (%s) ON CONFLICT DO NOTHING RETURNING alt_name_type_id
            ),
            alt_name_types_select AS (
                SELECT alt_name_type_id FROM alt_name_types_insert WHERE EXISTS (SELECT 1 FROM alt_name_types_insert)
                UNION ALL
                SELECT alt_name_type_id FROM alt_name_types WHERE alt_name_type=%s AND NOT EXISTS (SELECT 1 FROM alt_name_types_insert)
            )
            INSERT INTO alt_anime_names (alt_name, fk_alt_name_type_id, fk_anime_id) VALUES 
                (%s, (SELECT alt_name_type_id FROM alt_name_types_select), (SELECT anime_id FROM animes WHERE mal_anime_id=%s )) ON CONFLICT DO NOTHING
            """

            for alt_name_type in data["alt_names"]:
                for name in data["alt_names"][alt_name_type]:
                    db_cur.execute(alt_names_sql_query, (alt_name_type, alt_name_type, name, data["anime_mal_id"]))


            db_conn.commit()
        except psycopg2.InternalError as e:
            db_conn.rollback()
            logging.critical(e)
        db_cur.close()

    def write_json(self, data, filename='Animes.json'): 
        old_data = None
        with open(filename,'r') as f:
            old_data = json.load(f)

        with open(filename,'w') as f:
            old_data["data"].append(data) 
            json.dump(old_data, f, indent=4)
    