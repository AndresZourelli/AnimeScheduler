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
            db_cur.execute("INSERT INTO images (title, url) VALUES (%s, %s) ON CONFLICT DO NOTHING", (data["name"], data["image_url"]))
            db_cur.execute("INSERT INTO actors (mal_id, name, fk_actor_primary_image) VALUES (%s, %s, (SELECT id FROM images WHERE title =%s AND url=%s)) ON CONFLICT DO NOTHING", (data["actor_mal_id"], data["name"], data["image_url"]))
            db_cur.execute("INSERT INTO languages (language) VALUES (%s) ON CONFLICT DO NOTHING", (data["actor_language"],))
            db_cur.execute("INSERT INTO INSERT INTO character_actors (fk_character_id, fk_actor_id, fk_language_id) VALUES ((SELECT id FROM characters WHERE mal_id=%s), (SELECT id FROM actors WHERE mal_id=%s), (SELECT id FROM languages WHERE language=%s)) ON CONFLICT DO NOTHING", (data["character_mal_id"], data["actor_mal_id"], data["actor_language"]))
            db_cur.execute("INSERT INTO anime_actor (fk_anime_id, fk_actor_id, fk_language_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s), (SELECT id FROM actors mal_id=%s), (SELECT id FROM languages WHERE language=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], data["actor_mal_id"], data["actor_language"]))
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

            db_cur.execute("INSERT INTO images (title, url) VALUES (%s, %s) ON CONFLICT DO NOTHING", (data["name"], data["image_url"]))

            db_cur.execute("INSERT INTO staff (mal_id, name, image_url) VALUES (%s, %s) ON CONFLICT DO NOTHING", (data["name"], data["staff_mal_id"], data["image_url"]))

            db_cur.execute("INSERT INTO staff_images (fk_staff_id, fk_image_id) VALUES ((SELECT id FROM staff WHERE mal_id=%s), (SELECT id FROM images WHERE title=%s AND url=%s )) ON CONFLICT DO NOTHING", (data["staff_mal_id"], data["name"], data["image_url"]))
            
            db_cur.execute("INSERT INTO staff_roles (role) VALUES (%s) ON CONFLICT DO NOTHING", (data["role"],))

            db_cur.execute("INSERT INTO anime_staff (fk_anime_id, fk_staff_id, fk_staff_role_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM staff WHERE mal_id=%s), (SELECT id FROM staff_roles WHERE role=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], data["staff_mal_id"], data["role"]))
            
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

            db_cur.execute("INSERT INTO images (title, url) VALUES (%s, %s) ON CONFLICT DO NOTHING", (data["name"], data["image_url"]))

            db_cur.execute("INSERT INTO characters (mal_id, name, fk_character_primary_image, (SELECT id FROM images WHERE title=%s AND url=%s)) VALUES (%s, %s) ON CONFLICT DO NOTHING", (data["name"], data["image_url"], data["character_mal_id"], data["name"]) )

            db_cur.execute("INSERT INTO character_images (fk_character_id, fk_image_id) VALUES ((SELECT id FROM characters WHERE mal_id=%s), (SELECT id FROM images WHERE title=%s AND url=%s)) ON CONFLICT DO NOTHING",(data["character_mal_id"], data["name"], data["image_url"]))
            
            db_cur.execute("INSERT INTO character_roles (role) VALUES (%s) ON CONFLICT DO NOTHING", (data["role"],))
            
            db_cur.execute("INSERT INTO anime_character (fk_anime_id, fk_character_id, fk_character_role_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM characters WHERE mal_id=%s), (SELECT id FROM character_roles WHERE role=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], data["character_mal_id"], data["role"]))

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

            db_cur.execute("INSERT INTO airing_status_types (type) VALUES (%s) ON CONFLICT DO NOTHING", (data["status"],))

            db_cur.execute("INSERT INTO media_types (type) VALUES (%s) ON CONFLICT DO NOTHING", (data["type"],))

            db_cur.execute("INSERT INTO seasons (name) VALUES (%s) ON CONFLICT DO NOTHING", (data["season"],))

            db_cur.execute("INSERT INTO source_material_types (type) VALUES (%s) ON CONFLICT DO NOTHING", (data["source"],))
            anime_sql_query = """
            INSERT INTO animes 
            (mal_id, 
            title, 
            description, 
            number_of_episodes, 
            fk_airing_status_type_id,
            fk_media_type_id,
            start_broadcast_datetime,
            end_broadcast_datetime,
            fk_season_id,
            fk_source_material_id,
            duration,
            image_url,
            average_rating
            ) VALUES (
                %(mal_id)s, 
                %(title)s,
                %(description)s,
                %(episodes)s,
                (SELECT id FROM airing_status_types where type=%(status)s),
                (SELECT id FROM media_types where type=%(media_type)s),
                %(broadcast_start)s,
                %(broadcast_end)s,
                (SELECT id FROM seasons where season=%(season)s),
                (SELECT id FROM source_material_types where type=%(source)s),
                %(duration)s,
                %(image)s,
                %(rating)s
            ) ON CONFLICT (mal_id) DO UPDATE SET
            title = EXCLUDED.title, 
            description = EXCLUDED.description, 
            number_of_episodes = EXCLUDED.number_of_episodes, 
            fk_airing_status_type_id = EXCLUDED.fk_airing_status_type_id,
            fk_media_type_id = EXCLUDED.fk_media_type_id,
            start_broadcast_datetime = EXCLUDED.start_broadcast_datetime,
            end_broadcast_datetime = EXCLUDED.end_broadcast_datetime,
            fk_season_id = EXCLUDED.fk_season_id,
            fk_source_material_id = EXCLUDED.fk_source_material_id,
            duration = EXCLUDED.duration,
            image_url = EXCLUDED.image_url,
            average_rating = EXCLUDED.average_rating
            """
            variables = (
                {
                    "mal_id": data["anime_mal_id"],
                    "title": data["title"],
                    "description": data["description"],
                    "episodes": data["episodes"],
                    "broadcast_start": data["aired_start"],
                    "broadcast_end": data["aired_end"],
                    "duration": data["duration"],
                    "image": data["image_url"],
                    "rating": data["avg_score"]
                }
            ) 
            db_cur.execute(anime_sql_query, variables)
            
            db_cur.execute("INSERT INTO images (title, url) VALUES (%s, %s) ON CONFLICT DO NOTHING", (data["title"], data["image_url"]))

            db_cur.execute("INSERT INTO anime_images (fk_anime_id, fk_image_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s), (SELECT id FROM images WHERE title=%s AND url=%s )) ON CONFLICT DO NOTHING", (data["anime_mal_id"], data["title"], data["image_url"]))

            for producer_name in data["producers"]:
                db_cur.execute("INSERT INTO producers (name) VALUES (%s) ON CONFLICT DO NOTHING", (producer_name,))
                db_cur.execute("INSERT INTO anime_producer (fk_anime_id, fk_producer_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM producers WHERE name=%s)) ON CONFLICT DO NOTHING", ( data["anime_mal_id"], producer_name))

            for licensor_name in data["licensors"]:
                db_cur.execute("INSERT INTO licensors (name) VALUES (%s) ON CONFLICT DO NOTHING", (licensor_name,))
                db_cur.execute("INSERT INTO anime_licensor (fk_anime_id, fk_licensor_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM licensors WHERE name=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], licensor_name))

            for studio_name in data["studios"]:
                db_cur.execute("INSERT INTO studios (name) VALUES (%s) ON CONFLICT DO NOTHING", (studio_name,))
                db_cur.execute("INSERT INTO anime_studio (fk_anime_id, fk_studio_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM studios WHERE name=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], studio_name))

            for genre_name in data["genres"]:
                db_cur.execute("INSERT INTO genres (name) VALUES (%s) ON CONFLICT DO NOTHING", (genre_name,))
                db_cur.execute("INSERT INTO anime_genre (fk_anime_id, fk_genre_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM genres WHERE name=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], genre_name))

            for alt_name_type in data["alt_names"]:
                db_cur.execute("INSERT INTO alt_name_types (type) VALUES (%s) ON CONFLICT DO NOTHING", (alt_name_type,))
                for name in data["alt_names"][alt_name_type]:
                    db_cur.execute("INSERT INTO alt_anime_names (name, fk_alt_name_type_id, fk_anime_id) VALUES (%s, (SELECT id FROM alt_name_types WHERE type=%s), (SELECT id FROM animes WHERE mal_id=%s )) ON CONFLICT DO NOTHING", (name, alt_name_type, data["anime_mal_id"]))


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
    