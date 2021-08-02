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

db_conn = psycopg2.connect(database=DB, user=DB_USER, password=DB_PASSWORD, host="localhost", port="5433", connect_timeout=3)

class DefaultPipeline:
    def process_item(self, item, spider):
        for field in item.fields:
            item.setdefault(field, None)
        return item


class ActorsPipeline:
    def __init__(self): 
        self.actors_seen = set() 
        with open('Actors.json',"w") as json_file:
                json.dump({"data":[]},json_file)

    def process_item(self, item, spider):
        if item is None:
            return item

        if isinstance(item, ActorItem):
            if ((item['anime_mal_id'], item["actor_mal_id"], item["character_mal_id"])) in self.actors_seen:
                raise DropItem("Repeated Actors found: %s" % item)
            else:
                self.actors_seen.add((item['anime_mal_id'], item["actor_mal_id"], item["character_mal_id"]))
                self.insert_db(ItemAdapter(item).asdict())
                 
                return item
        return item
    
    def insert_db(self, data):
        try: 
            db_cur = db_conn.cursor()

            db_cur.execute("INSERT INTO images (title, url) VALUES (%s, %s) ON CONFLICT DO NOTHING", (f"{data['actor_first_name']} {data['actor_last_name']}", data["actor_image_url"]))
            db_cur.execute("INSERT INTO persons (mal_id, first_name, last_name, native_name, alternate_names, description, person_image_id) VALUES (%s, %s, %s, %s, %s, %s, (SELECT id FROM images WHERE url=%s LIMIT 1)) ON CONFLICT DO NOTHING", (data["actor_mal_id"], data["actor_first_name"], data["actor_last_name"], data["native_name"], data["alt_names"], data["description"], data["actor_image_url"]))
            db_cur.execute("INSERT INTO character_roles (role) VALUES (%s) ON CONFLICT DO NOTHING", (data["character_role"],))
            db_cur.execute("INSERT INTO languages (language) VALUES (%s) ON CONFLICT DO NOTHING", (data["actor_language"],))
            db_cur.execute("INSERT INTO anime_character (anime_id, character_id, person_id, role, language) VALUES ((SELECT id FROM animes WHERE mal_id=%s), (SELECT id FROM characters WHERE mal_id=%s), (SELECT id FROM persons WHERE mal_id=%s), (SELECT id FROM character_roles WHERE role=%s), (SELECT id FROM languages WHERE language=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], data["character_mal_id"], data["actor_mal_id"], data["character_role"], data["actor_language"]))
            
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
            if ((item['staff_mal_id'],item["anime_mal_id"])) in self.staff_seen:
                raise DropItem("Repeated Staff found: %s" % item)
            else:
                self.staff_seen.add((item['staff_mal_id'],item["anime_mal_id"]))
                self.insert_db(ItemAdapter(item).asdict())
                 
                return item
        return item
    
    def insert_db(self, data):
        try:
            db_cur = db_conn.cursor()

            db_cur.execute("INSERT INTO images (title, url) VALUES (%s, %s) ON CONFLICT DO NOTHING", (f"{data['staff_first_name']} {data['staff_last_name']}", data["staff_image_url"]))
            db_cur.execute("INSERT INTO persons (mal_id, first_name, last_name, native_name, alternate_names, description, person_image_id) VALUES (%s, %s, %s, %s, %s, %s, (SELECT id FROM images WHERE url=%s LIMIT 1)) ON CONFLICT DO NOTHING", (data["staff_mal_id"], data["staff_first_name"], data["staff_last_name"], data["native_name"], data["alt_names"], data["description"], data["staff_image_url"]))
            db_cur.execute("INSERT INTO person_images (person_id, image_id) VALUES ((SELECT id FROM persons WHERE mal_id=%s), (SELECT id FROM images WHERE url=%s LIMIT 1)) ON CONFLICT DO NOTHING", (data["staff_mal_id"], data["staff_image_url"]))
            db_cur.execute("INSERT INTO staff_roles (role) VALUES (%s) ON CONFLICT DO NOTHING", (data["staff_role"],))
            db_cur.execute("INSERT INTO anime_staff (anime_id, person_id, staff_role_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM persons WHERE mal_id=%s), (SELECT id FROM staff_roles WHERE role=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], data["staff_mal_id"], data["staff_role"]))
            
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
            if ((item['character_mal_id'],item["anime_mal_id"])) in self.characters_seen:
                raise DropItem("Repeated Characters found: %s" % item)
            else:
                self.characters_seen.add((item['character_mal_id'],item["anime_mal_id"]))
                self.insert_db(ItemAdapter(item).asdict())
                 
                return item
        return item

    def insert_db(self, data):
        try:
            db_cur = db_conn.cursor()

            db_cur.execute("INSERT INTO images (title, url) VALUES (%s, %s) ON CONFLICT DO NOTHING", (data["name"], data["image_url"]))
            db_cur.execute("INSERT INTO characters (mal_id, name, description, character_image_id) VALUES (%s, %s, %s, (SELECT id FROM images WHERE url=%s LIMIT 1)) ON CONFLICT (mal_id) DO UPDATE SET name = EXCLUDED.name, description=EXCLUDED.description, character_image_id=EXCLUDED.character_image_id", (data["character_mal_id"], data["name"], data["character_description"], data["image_url"]) )
            db_cur.execute("INSERT INTO character_images (character_id, image_id) VALUES ((SELECT id FROM characters WHERE mal_id=%s), (SELECT id FROM images WHERE url=%s LIMIT 1)) ON CONFLICT DO NOTHING",(data["character_mal_id"], data["image_url"]))
            
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
            if (item['title']) in self.animes_seen:
                raise DropItem("Repeated Animes found: %s" % item)
            else:
                self.animes_seen.add(item['title'])

                if "season" not in item:
                    item["season"] = None

                if "aired_end" not in item:
                    item["aired_end"] = None

                self.insert_db(ItemAdapter(item).asdict())
                 
                # self.write_json(dict(item))
                return item
        return item

    def insert_db(self, data):
        try:
            db_cur = db_conn.cursor()

            db_cur.execute("INSERT INTO source_material_types (source_material_type) VALUES (%s) ON CONFLICT DO NOTHING", (data["source"],))
            db_cur.execute("INSERT INTO media_types (media_type) VALUES (%s) ON CONFLICT DO NOTHING", (data["type"],))
            db_cur.execute("INSERT INTO seasons (season) VALUES (%s) ON CONFLICT DO NOTHING", (data["season"],))
            db_cur.execute("INSERT INTO airing_status_types (airing_status_type) VALUES (%s) ON CONFLICT DO NOTHING", (data["status"],))
            db_cur.execute("INSERT INTO age_rating_types (age_rating_type) VALUES (%s) ON CONFLICT DO NOTHING", (data["age_rating"],))
            db_cur.execute("INSERT INTO images (title, url) VALUES (%s, %s) ON CONFLICT DO NOTHING", (data["title"], data["image_url"]))

            anime_sql_query = """
            INSERT INTO animes 
            (mal_id, 
            title, 
            description, 
            number_of_episodes, 
            start_broadcast_datetime,
            end_broadcast_datetime,
            duration,
            average_watcher_rating,
            airing_status_id,
            media_type_id,
            season_id,
            source_material_id,
            profile_image_id,
            age_rating_id
            ) VALUES (
                %(mal_id)s, 
                %(title)s,
                %(description)s,
                %(episodes)s,
                %(broadcast_start)s,
                %(broadcast_end)s,
                %(duration)s,
                %(average_watcher_rating)s,
                (SELECT id FROM airing_status_types WHERE airing_status_type=%(status)s),
                (SELECT id FROM media_types WHERE media_type=%(media_type)s),
                (SELECT id FROM seasons WHERE season=%(season)s),
                (SELECT id FROM source_material_types WHERE source_material_type=%(source)s),
                (SELECT id FROM images WHERE url=%(profile_image)s LIMIT 1),
                (SELECT id FROM age_rating_types WHERE age_rating_type=%(age_rating)s)
            ) ON CONFLICT (mal_id) DO UPDATE SET
            title = EXCLUDED.title, 
            description = EXCLUDED.description, 
            number_of_episodes = EXCLUDED.number_of_episodes, 
            start_broadcast_datetime = EXCLUDED.start_broadcast_datetime,
            end_broadcast_datetime = EXCLUDED.end_broadcast_datetime,
            duration = EXCLUDED.duration,
            average_watcher_rating = EXCLUDED.average_watcher_rating,
            airing_status_id = EXCLUDED.airing_status_id,
            media_type_id = EXCLUDED.media_type_id,
            season_id = EXCLUDED.season_id,
            source_material_id = EXCLUDED.source_material_id,
            profile_image_id = EXCLUDED.profile_image_id,
            age_rating_id = EXCLUDED.age_rating_id
            """
            variables = (
                {
                    "mal_id": data["anime_mal_id"],
                    "title": data["title"],
                    "description": data["description"],
                    "episodes": data["episodes"],
                    "status": data["status"],
                    "media_type": data["type"],
                    "broadcast_start": data["aired_start"],
                    "broadcast_end": data["aired_end"],
                    "season": data["season"],
                    "source": data["source"],
                    "duration": data["duration"],
                    "profile_image": data["image_url"],
                    "average_watcher_rating": data["avg_score"],
                    "age_rating": data["age_rating"]
                }
            ) 
            db_cur.execute(anime_sql_query, variables)
            

            db_cur.execute("INSERT INTO anime_images (anime_id, image_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s), (SELECT id FROM images WHERE title=%s AND url=%s LIMIT 1 )) ON CONFLICT DO NOTHING", (data["anime_mal_id"], data["title"], data["image_url"]))

            for producer_name in data["producers"]:
                db_cur.execute("INSERT INTO producers (producer) VALUES (%s) ON CONFLICT DO NOTHING", (producer_name,))
                db_cur.execute("INSERT INTO anime_producer (anime_id, producer_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM producers WHERE producer=%s)) ON CONFLICT DO NOTHING", ( data["anime_mal_id"], producer_name))

            for licensor_name in data["licensors"]:
                db_cur.execute("INSERT INTO licensors (licensor) VALUES (%s) ON CONFLICT DO NOTHING", (licensor_name,))
                db_cur.execute("INSERT INTO anime_licensor (anime_id, licensor_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM licensors WHERE licensor=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], licensor_name))

            for studio_name in data["studios"]:
                db_cur.execute("INSERT INTO studios (studio) VALUES (%s) ON CONFLICT DO NOTHING", (studio_name,))
                db_cur.execute("INSERT INTO anime_studio (anime_id, studio_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM studios WHERE studio=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], studio_name))

            for genre_name in data["genres"]:
                db_cur.execute("INSERT INTO genres (genre) VALUES (%s) ON CONFLICT DO NOTHING", (genre_name,))
                db_cur.execute("INSERT INTO anime_genre (anime_id, genre_id) VALUES ((SELECT id FROM animes WHERE mal_id=%s ), (SELECT id FROM genres WHERE genre=%s)) ON CONFLICT DO NOTHING", (data["anime_mal_id"], genre_name))

            for name in data["alt_names"]:
                db_cur.execute("INSERT INTO alternate_anime_names (name, anime_id) VALUES (%s, (SELECT id FROM animes WHERE mal_id=%s )) ON CONFLICT DO NOTHING", (name, data["anime_mal_id"]))


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
    
class LastStep:
    def __init__(self): 
        self.count = 0
    
    def process_item(self, item, spider):
        if item is None:
            return item
        if isinstance(item, AnimeItem):
            self.count += 1
            logging.critical(f"------- Anime Processed: {self.count} -------")