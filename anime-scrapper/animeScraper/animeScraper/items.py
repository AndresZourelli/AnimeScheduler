# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from itemloaders.processors import TakeFirst, MapCompose

def fixName(value):
    if "," in value:
        last_name, first_name = [x.strip() for x in value.split(",")]
        return first_name+" "+last_name
    return value

def fixImage(value):
    fixedSting = value.replace("/r/42x62","").split("?s=", 1)[0]
    return fixedSting

class ActorItem(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field( input_processor=MapCompose(fixName), output_processor = TakeFirst())
    image_url = scrapy.Field( input_processor=MapCompose(fixImage), output_processor = TakeFirst())
    actor_language = scrapy.Field( output_processor = TakeFirst())
    anime = scrapy.Field( output_processor = TakeFirst())
    character = scrapy.Field(input_processor=MapCompose(fixName), output_processor = TakeFirst())
    character_image_url = scrapy.Field(input_processor=MapCompose(fixImage), output_processor = TakeFirst())

class StaffItem(scrapy.Item):
    name = scrapy.Field( input_processor=MapCompose(fixName), output_processor = TakeFirst())
    image_url = scrapy.Field(input_processor=MapCompose(fixImage), output_processor = TakeFirst())
    role = scrapy.Field( output_processor = TakeFirst())
    anime = scrapy.Field( output_processor = TakeFirst())

class CharacterItem(scrapy.Item):
    name = scrapy.Field( input_processor=MapCompose(fixName), output_processor = TakeFirst())
    image_url = scrapy.Field( input_processor=MapCompose(fixImage), output_processor = TakeFirst())
    role = scrapy.Field( output_processor = TakeFirst())
    anime = scrapy.Field( output_processor = TakeFirst())

class AnimeItem(scrapy.Item):
    title = scrapy.Field(output_processor = TakeFirst())
    aired_start = scrapy.Field(output_processor = TakeFirst())
    aired_end = scrapy.Field(output_processor = TakeFirst())
    alt_names = scrapy.Field(output_processor = TakeFirst())
    broadcast_day = scrapy.Field(output_processor = TakeFirst())
    broadcast_time = scrapy.Field(output_processor = TakeFirst())
    description = scrapy.Field(output_processor = TakeFirst())
    duration = scrapy.Field(output_processor = TakeFirst())
    episodes = scrapy.Field(output_processor = TakeFirst())
    genres = scrapy.Field(output_processor = TakeFirst())
    image_url = scrapy.Field(output_processor = TakeFirst())
    licensors = scrapy.Field(output_processor = TakeFirst())
    producers = scrapy.Field(output_processor = TakeFirst())
    rating = scrapy.Field(output_processor = TakeFirst())
    season = scrapy.Field(output_processor = TakeFirst())
    source = scrapy.Field(output_processor = TakeFirst())
    status = scrapy.Field(output_processor = TakeFirst())
    studios = scrapy.Field(output_processor = TakeFirst())
    type = scrapy.Field(output_processor = TakeFirst())
    avg_score = scrapy.Field(output_processor = TakeFirst())
