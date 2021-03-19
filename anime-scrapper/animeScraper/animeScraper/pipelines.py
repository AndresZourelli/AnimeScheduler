# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from animeScraper.items import ActorItem, StaffItem, CharacterItem, AnimeItem
import json
from scrapy.exceptions import DropItem  
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import logging 

from scrapy.item import Item

from scrapy.loader import ItemLoader
load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)
db = client["animeDB"]

class ActorsPipeline:
    def __init__(self): 
        self.actors_seen = set() 
        with open('Actors.json',"w") as json_file:
                json.dump({"data":[]},json_file)

    def process_item(self, item, spider):
        if item is None:
            return item

        if isinstance(item, ActorItem):
            if (item['name'], item["anime"]) in self.actors_seen:
                raise DropItem("Repeated Actors found: %s" % item)
            else:
                self.actors_seen.add((item['name'], item["anime"]))
                self.insert_mongo(ItemAdapter(item).asdict())
                return item
        return item
    
    def insert_mongo(self, data): 
        actor_collection = db["actors"]
        anime_collection = db["animes"]
        actor_db_data = actor_collection.find_one({"name": data['name']})
        if actor_db_data:
            updated_actor = actor_collection.find_one_and_update({"name":data["name"]},{"$addToSet": {
                "animes": {"anime": data["anime"], "character": data["character"]}
            }})
            anime_collection.update_one({"title":data["anime"]},{"$addToSet":{
                "actors": {"id": updated_actor["_id"], "name": data["name"], "image_url": data["image_url"],
                "actor_language":data["actor_language"]}
            }})
        else:   
            actor_result = actor_collection.insert_one({
                "name":data["name"],
                "image_url":data["image_url"],
                "actor_language":data["actor_language"],
                "animes":[{"anime":data["anime"], "character": data["character"]}]
            })
            anime_collection.update_one({"title":data["anime"]},{"$addToSet":{
                "actors": {"id": actor_result.inserted_id, "name": data["name"], "image_url": data["image_url"], "actor_language":data["actor_language"]}
            }})

class StaffPipeline:
    def __init__(self): 
        self.staff_seen = set()
        with open('Staff.json',"w") as json_file:
            json.dump({"data":[]},json_file) 

    def process_item(self, item, spider):
        if item is None:
            return item

        if isinstance(item, StaffItem):
            if (item['name'], item["anime"]) in self.staff_seen:
                raise DropItem("Repeated Staff found: %s" % item)
            else:
                self.staff_seen.add((item['name'], item["anime"]))
                self.insert_mongo(ItemAdapter(item).asdict())
                return item
        return item
    
    def insert_mongo(self, data):
        staff_collection = db["staffs"]
        anime_collection = db["animes"]
        staff_db_data = staff_collection.find_one({"name": data['name']})
        if staff_db_data:
            updated_staff = staff_collection.find_one_and_update({"name":data["name"]},{"$addToSet": {
                "animes": {"anime":data["anime"], "role":data["role"] }
            }})
            anime_collection.update_one({"title":data["anime"]},{"$addToSet":{
                "staff": {"id": updated_staff["_id"], "name": data["name"], "image_url": data["image_url"], "role":data["role"]}
            }})
        else:   
            staff_result = staff_collection.insert_one({
                "name":data["name"],
                "image_url":data["image_url"],
                "animes":[{"anime":data["anime"], "role":data["role"] }]
            })
            anime_collection.update_one({"title":data["anime"]},{"$addToSet":{
                "staff": {"id": staff_result.inserted_id, "name": data["name"], "image_url": data["image_url"],"role":data["role"]}
            }})

class CharacterPipeline:
    def __init__(self): 
        self.characters_seen = set()
        with open('Characters.json',"w") as json_file:
            json.dump({"data":[]},json_file)

    def process_item(self, item, spider):
        if item is None:
            return item
        if isinstance(item, CharacterItem):
            if (item['name'], item["anime"]) in self.characters_seen:
                raise DropItem("Repeated Characters found: %s" % item)
            else:
                self.characters_seen.add((item['name'], item["anime"]))
                self.insert_mongo(ItemAdapter(item).asdict())
                return item
        return item

    def insert_mongo(self, data):
        character_collection = db["characters"]
        anime_collection = db["animes"]

        characters_db_data = character_collection.find_one({"name": data['name']})
        if characters_db_data:
            updated_character = character_collection.find_one_and_update({"name":data["name"]},{"$addToSet": {
                "animes": data["anime"]
            }})
            anime_collection.update_one({"title":data["anime"]},{"$addToSet":{
                "characters": {"id": updated_character["_id"], "name": data["name"], "image_url": data["image_url"], "role":data["role"], "actor":data["actor"]}
            }})
        else:   
            if not "actor" in data:
                data["actor"] = "None"
            character_result = character_collection.insert_one({
                "name":data["name"],
                "image_url":data["image_url"],
                "role":data["role"],
                "animes":[data["anime"]], 
                "actor": data["actor"]
            })
            anime_collection.update_one({"title":data["anime"]},{"$addToSet":{
                "characters": {"id": character_result.inserted_id, "name": data["name"], "image_url": data["image_url"],"role":data["role"], "actor":data["actor"]}
            }})

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
                self.write_json(dict(item))
                return item
        return item

    def write_json(self, data, filename='Animes.json'): 
        old_data = None
        with open(filename,'r') as f:
            old_data = json.load(f)

        with open(filename,'w') as f:
            old_data["data"].append(data) 
            json.dump(old_data, f, indent=4)
    