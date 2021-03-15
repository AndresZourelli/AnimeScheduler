# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from w3lib.html import remove_tags
from scrapy.loader import ItemLoader
from itemloaders.processors import TakeFirst, MapCompose

def fixName(value):
    if "," in value:
        last_name, first_name = [x.strip() for x in value.split(",")]
        return first_name+" "+last_name
    return value



class ActorItem(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field( input_processor=MapCompose(fixName), output_processor = TakeFirst())
    image_url = scrapy.Field( output_processor = TakeFirst())
    actor_language = scrapy.Field( output_processor = TakeFirst())
    anime = scrapy.Field( output_processor = TakeFirst())
    character = scrapy.Field(input_processor=MapCompose(fixName), output_processor = TakeFirst())

class StaffItem(scrapy.Item):
    name = scrapy.Field( input_processor=MapCompose(fixName), output_processor = TakeFirst())
    image_url = scrapy.Field( output_processor = TakeFirst())
    role = scrapy.Field( output_processor = TakeFirst())
    anime = scrapy.Field( output_processor = TakeFirst())

class CharacterItem(scrapy.Item):
    name = scrapy.Field( input_processor=MapCompose(fixName), output_processor = TakeFirst())
    image_url = scrapy.Field( output_processor = TakeFirst())
    role = scrapy.Field( output_processor = TakeFirst())
    anime = scrapy.Field( output_processor = TakeFirst())
    actor = scrapy.Field(input_processor=MapCompose(fixName), output_processor = TakeFirst())

class AnimeItem(scrapy.Item):
    title = scrapy.Field(output_processor = TakeFirst())
