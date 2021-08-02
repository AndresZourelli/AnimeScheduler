# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
import logging
import re
from itemloaders.processors import TakeFirst, MapCompose

def fixName(value):
    if "," in value:
        last_name, first_name = [x.strip() for x in value.split(",")]
        return first_name+" "+last_name
    return value

def getFirstName(value):
    if "," in value:
        last_name, first_name = [x.strip() for x in value.split(",")]
        return first_name
    return value

def getLastName(value):
    if "," in value:
        last_name, first_name = [x.strip() for x in value.split(",")]
        return last_name
    return None

def fixImage(value):
    fixedSting = value.replace("/r/42x62","").split("?s=", 1)[0]
    return fixedSting

def getMinutes(value):
    only_number_regex = re.compile(r'(^\d+$)')
    if only_number_regex.search(value):
        return value
    cleaned_value = value.replace(" ", "").replace(".","")
    regex = re.compile(r'((?P<hour>\d+?)hr)?((?P<minute>\d+?)min)?')
    parts = regex.match(cleaned_value)
    if not parts:
        return "0"
    
    parts = parts.groupdict()
    time_in_min = 0
    for time_unit in parts:
        if time_unit == "hour" and parts["hour"] is not None:
            time_in_min += int(parts[time_unit]) * 60
        elif time_unit == "minute" and parts["minute"] is not None:
            time_in_min += int(parts[time_unit])
    return str(time_in_min)

def getDuration(value):
    if value == None:
        return "0"
    if isinstance(value, str) and value.lower() == "unknown":
        return "0"
    return value

class ActorItem(scrapy.Item):
    actor_mal_id = scrapy.Field(output_processor = TakeFirst())
    actor_first_name = scrapy.Field( input_processor=MapCompose(getFirstName), output_processor = TakeFirst())
    actor_last_name = scrapy.Field( input_processor=MapCompose(getLastName), output_processor = TakeFirst())
    actor_image_url = scrapy.Field( input_processor=MapCompose(fixImage), output_processor = TakeFirst())
    actor_language = scrapy.Field( output_processor = TakeFirst())
    anime = scrapy.Field( output_processor = TakeFirst())
    character = scrapy.Field(input_processor=MapCompose(fixName), output_processor = TakeFirst())
    character_image_url = scrapy.Field(input_processor=MapCompose(fixImage), output_processor = TakeFirst())
    character_mal_id = scrapy.Field(output_processor = TakeFirst())
    anime_mal_id = scrapy.Field( output_processor = TakeFirst())
    description = scrapy.Field( output_processor = TakeFirst())
    alt_names = scrapy.Field(output_processor = TakeFirst())
    native_name = scrapy.Field(output_processor = TakeFirst())
    character_role = scrapy.Field( output_processor = TakeFirst())
class StaffItem(scrapy.Item):
    staff_mal_id = scrapy.Field(output_processor = TakeFirst())
    staff_first_name = scrapy.Field( input_processor=MapCompose(getFirstName), output_processor = TakeFirst())
    staff_last_name = scrapy.Field( input_processor=MapCompose(getLastName), output_processor = TakeFirst())
    staff_image_url = scrapy.Field(input_processor=MapCompose(fixImage), output_processor = TakeFirst())
    staff_role = scrapy.Field( output_processor = TakeFirst())
    anime = scrapy.Field( output_processor = TakeFirst())
    anime_mal_id = scrapy.Field( output_processor = TakeFirst())
    description = scrapy.Field( output_processor = TakeFirst())
    alt_names = scrapy.Field(output_processor = TakeFirst())
    native_name = scrapy.Field(output_processor = TakeFirst())


class CharacterItem(scrapy.Item):
    character_mal_id = scrapy.Field(output_processor = TakeFirst())
    name = scrapy.Field( input_processor=MapCompose(fixName), output_processor = TakeFirst())
    image_url = scrapy.Field( input_processor=MapCompose(fixImage), output_processor = TakeFirst())
    character_role = scrapy.Field( output_processor = TakeFirst())
    anime = scrapy.Field( output_processor = TakeFirst())
    anime_mal_id = scrapy.Field( output_processor = TakeFirst())
    character_description = scrapy.Field(output_processor = TakeFirst())
class AnimeItem(scrapy.Item):
    anime_mal_id = scrapy.Field(output_processor = TakeFirst())
    title = scrapy.Field(output_processor = TakeFirst())
    avg_score = scrapy.Field(output_processor = TakeFirst())
    description = scrapy.Field(output_processor = TakeFirst())
    alt_names = scrapy.Field()
    type = scrapy.Field(output_processor = TakeFirst())
    episodes = scrapy.Field(input_processor=MapCompose(getDuration), output_processor = TakeFirst())
    status = scrapy.Field(output_processor = TakeFirst())
    season = scrapy.Field(output_processor = TakeFirst())
    broadcast_day = scrapy.Field(output_processor = TakeFirst())
    broadcast_time = scrapy.Field(output_processor = TakeFirst())
    producers = scrapy.Field()
    licensors = scrapy.Field()
    studios = scrapy.Field()
    genres = scrapy.Field()
    source = scrapy.Field(output_processor = TakeFirst())
    duration = scrapy.Field(input_processor=MapCompose(getMinutes), output_processor = TakeFirst())
    age_rating = scrapy.Field(output_processor = TakeFirst())
    image_url = scrapy.Field(output_processor = TakeFirst())
    aired_start = scrapy.Field(output_processor = TakeFirst())
    aired_end = scrapy.Field(output_processor = TakeFirst())
