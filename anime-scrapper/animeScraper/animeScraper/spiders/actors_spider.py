import re
from scrapy.loader import ItemLoader
import scrapy
from scrapy import Request
from animeScraper.items import ActorItem, StaffItem, CharacterItem, AnimeItem
import datetime
import pytz
import logging
from urllib.parse import urlparse
from dotenv import load_dotenv
import os
import psycopg2 
load_dotenv()

DB = os.getenv("DB")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

db_conn = psycopg2.connect(database=DB, user=DB_USER, password=DB_PASSWORD, host="localhost", port="5433", connect_timeout=3)
class ActorsSpider(scrapy.Spider):
    name = "actors"

    count = 1
    COUNT_MAX = 100
    start_urls = [
        "https://myanimelist.net/topanime.php"
    ]

    def parse(self, response):
        for anime in response.css("tr.ranking-list"):
            if(self.count > self.COUNT_MAX):
                break
            
            anime_link = anime.css('a.hoverinfo_trigger').attrib["href"]
            yield response.follow(anime_link, callback=self.anime_page_parse)

            character_page_link = anime_link + "/characters"
            yield response.follow(character_page_link, callback=self.character_page_parse)
            
            self.count += 1

        next_page = response.css("a.link-blue-box.next::attr(href)").get()
        if next_page is not None and self.count <= self.COUNT_MAX:
            yield response.follow(next_page, callback=self.parse)

    def anime_page_parse(self, response):
        anime_loader = ItemLoader(item=AnimeItem())

        anime_loader.add_value("anime_mal_id", get_mal_id(response.request.url))
        title = response.xpath('//h1[contains(@class,"title-name")]/strong/text()').extract_first()
        anime_loader.add_value("title", title)
        score = response.xpath('//div[contains(@class,"score-label")]/text()').extract_first()
        anime_loader.add_value("avg_score", score)
        non_normal_description = response.xpath("//p[@itemprop='description']")
        normalized_description = non_normal_description.xpath("normalize-space(.)").extract_first()
        anime_loader.add_value("description", normalized_description.strip())

        languages_path = response.xpath('//*[preceding-sibling::h2[.="Alternative Titles"] and following-sibling::h2[. = "Information"]]/../div[@class="spaceit_pad"]')
        alternate_names = []
        for language in languages_path:
            value = "".join(language.xpath("./text()").extract()).strip()
            for name in [x.strip() for x in value.split(',')]:
                alternate_names.append(name)

        anime_loader.add_value("alt_names", alternate_names)

        information_data = response.xpath('//*[preceding-sibling::h2[.="Information"] and following-sibling::h2[. = "Statistics"]]')
        only_info_divs = information_data.css("div")
        hold_dates = {}
        for item in only_info_divs:
            key, value = item.xpath("normalize-space(.)").extract_first().split(": ")
            if key == "Type":
                anime_loader.add_value("type", value)
            elif key == "Episodes":
                anime_loader.add_value("episodes", value)
            elif key == "Status":
                anime_loader.add_value("status", value)
            elif key == "Aired":
                split_aired = [x.strip() for x in value.split("to")]
                hold_dates["start"] = split_aired[0]
                if len(split_aired) > 1:
                    hold_dates["end"] = split_aired[1]
                else:
                    hold_dates["end"] = None
            elif key == "Premiered":
                anime_loader.add_value("season", value)
            elif key == "Broadcast":
                time = [x.strip() for x in value.split(" at ")]
                if len(time) > 1:
                    hold_dates["time"] = time[1].replace("(JST)","").strip()
                    anime_loader.add_value("broadcast_day", time[0])
                    anime_loader.add_value("broadcast_time", time[1])
                else:
                    anime_loader.add_value("broadcast_day", None)
                    anime_loader.add_value("broadcast_time", None)
            elif key == "Producers":
                producers = [x.strip() for x in value.split(",")]
                anime_loader.add_value("producers", producers)
            elif key == "Licensors":
                licensors = [x.strip() for x in value.split(",")]
                anime_loader.add_value("licensors", licensors)
            elif key == "Studios":
                studios = [x.strip() for x in value.split(",")]
                anime_loader.add_value("studios", studios)
            elif key == "Source":
                anime_loader.add_value("source", value)
            elif key == "Genres":
                find_genres = item.xpath("./a/text()").extract()
                genres = [x.strip() for x in find_genres]
                anime_loader.add_value("genres", genres)
            elif key == "Duration":
                clean_duration = value.replace("min. per ep.","").strip()
                anime_loader.add_value("duration", clean_duration)
            elif key == "Rating":
                anime_loader.add_value("age_rating", value)

        image_url = response.xpath("//div[@id='content']//img[@itemprop='image']/@data-src").extract_first()
        anime_loader.add_value("image_url",image_url)
        
        if "time" in hold_dates:
            start_date = set_date(hold_dates["start"], hold_dates["time"])
            end_date = set_date(hold_dates["end"], hold_dates["time"])
        else:
            start_date = hold_dates["start"]
            end_date = None

        anime_loader.add_value("aired_start", start_date)
        anime_loader.add_value("aired_end", end_date)

        yield anime_loader.load_item()

    def character_page_parse(self, response):
        info_containers = response.xpath('//div[@id="content"]//div[@class="js-scrollfix-bottom-rel"]/table[@border="0" and @cellpadding="0" and @cellspacing="0" and @width="100%" ]')
        anime_title = response.xpath("//h1[@class='title-name h1_bold_none']/strong/text()").extract_first()
        mal_anime_id = get_mal_id(response.request.url)

        for container in info_containers:
            staff_loader = ItemLoader(item = StaffItem())
            character_staff = container.xpath("./tr/td")
            character_staff_image_url = character_staff[0].xpath(".//img/@data-src").extract_first()
            character_staff_name = character_staff[1].xpath("./a/text()").extract_first()
            character_staff_url = character_staff[1].xpath("./a/@href").extract_first()
            character_staff_role = character_staff[1].xpath(".//div[@class='spaceit_pad']/small/text()").extract_first()
            # character_staff_native_name = #TODO
            # character_staff_alt_names = #TODO
            # staff_description = #TODO
            character_staff_type = "staff"

            if len(character_staff ) == 3:
                character_loader = ItemLoader(item = CharacterItem())
                actor_loader = ItemLoader(item = ActorItem())
                character_staff_type = "character"
                all_actors = character_staff[2].xpath(".//tr")

                character_loader.add_value("name", character_staff_name)
                character_loader.add_value("image_url", character_staff_image_url)
                character_mal_id = get_mal_id(character_staff_url)
                character_loader.add_value("character_mal_id", character_mal_id)
                
                actor_loader.add_value("character_role", character_staff_role)
               
                character_page_link = f"https://myanimelist.net/character/{character_mal_id}"
                character_loader.add_value("anime_mal_id", mal_anime_id)
                yield response.follow( character_page_link, callback=self.character_page, meta={"item":character_loader})

                for actor in all_actors:
                    actor_data = actor.xpath(".//td")
                    actor_name = actor_data[0].xpath(".//a/text()").extract_first()
                    actor_language = actor_data[0].xpath(".//small/text()").extract_first()
                    mal_id_actor = actor_data[0].xpath(".//a/@href").extract_first()
                    actor_image = actor_data[1].xpath(".//img/@data-src").extract_first()
                    # actor_description = ##DONE
                    # actor_alt_names = ##Done
                    # actor_native_name = ##DONE

                    actor_loader.add_value("actor_first_name", actor_name)
                    actor_loader.add_value("actor_last_name", actor_name)
                    actor_loader.add_value("actor_image_url", actor_image)

                    actor_loader.add_value("actor_language", actor_language)
                    parsed_actor_mal_id = get_mal_id(mal_id_actor)
                    actor_loader.add_value("actor_mal_id", parsed_actor_mal_id)

                    actor_loader.add_value("character_image_url", character_staff_image_url)
                    actor_loader.add_value("character_mal_id", character_mal_id)
                    actor_loader.add_value("anime_mal_id", mal_anime_id)

                    person_page_link = f"https://myanimelist.net/people/{parsed_actor_mal_id}" 
                    yield response.follow(person_page_link, callback=self.person_page_parse, meta={'item': actor_loader})

            else:
                parsed_staff_mal_id = get_mal_id(character_staff_url)
                staff_loader.add_value("staff_mal_id", parsed_staff_mal_id)
                staff_loader.add_value("staff_first_name", character_staff_name)
                staff_loader.add_value("staff_last_name", character_staff_name)
                staff_loader.add_value("staff_image_url", character_staff_image_url)
                staff_loader.add_value("staff_role", character_staff_role)
                staff_loader.add_value("anime_mal_id", mal_anime_id)
                person_page_link = f"https://myanimelist.net/people/{parsed_staff_mal_id}" 
                yield response.follow(person_page_link, callback=self.person_page_parse, meta={'item': staff_loader})
    
    def person_page_parse(self, response):
        given_name = response.xpath("normalize-space(.//*[@id='content']/table/tr/td[1]//*[contains(text(), 'Given name')]/following-sibling::text())").get()
        family_name = response.xpath("normalize-space(.//*[@id='content']/table/tr/td[1]//*[contains(text(), 'Family name')]/following-sibling::text())").get()
        other_info = response.xpath("normalize-space(.//*[@id='content']/table/tr/td[1]//*[contains(@class,'people-informantion-more')])").getall()
        alt_names = response.xpath("normalize-space(.//*[@id='content']/table/tr/td[1]//*[contains(text(), 'Alternate names')]/following-sibling::text())").get()

        item = response.meta['item']
        item.add_value("description", other_info)
        item.add_value("native_name", f"{family_name} {given_name}")
        item.add_value("alt_names", alt_names)
        yield item.load_item()
    
    def character_page(self, response):
        item = response.meta['item']
        character_description = [ x.strip() for x in response.xpath(".//div[@id='content']/table/tr/td[2]/h2[1]/following-sibling::text()[preceding::div[1] and normalize-space()]").getall()]
        item.add_value("character_description", "\n".join(character_description))
        yield item.load_item() 

def set_date(date=None, time=None):
    try:
        date_str = date + " " + time
        date_time_obj = datetime.datetime.strptime(date_str, "%b %d, %Y %H:%M")
        japan_tz = pytz.timezone("Asia/Tokyo")
        jp_local_dt = japan_tz.localize(date_time_obj)
        utc_time = jp_local_dt.astimezone(pytz.utc).isoformat()
        return utc_time
    except Exception:
        return datetime.datetime(1900, 1, 1, 12, 00, 00, 00, tzinfo=pytz.utc).astimezone(pytz.utc).isoformat()

def get_mal_id(url):
    path = urlparse(url).path.split("/")
    return path[2]

