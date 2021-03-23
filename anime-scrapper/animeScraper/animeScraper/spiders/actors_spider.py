from scrapy.loader import ItemLoader
import scrapy
from animeScraper.items import ActorItem, StaffItem, CharacterItem, AnimeItem
import datetime
import pytz
class ActorsSpider(scrapy.Spider):
    name = "actors"

    count = 0
    COUNT_MAX=3000
    start_urls = [
        "https://myanimelist.net/topanime.php"
    ]

    def parse(self, response):
        for anime in response.css("tr.ranking-list"):
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

        title = response.xpath('//h1[contains(@class,"title-name")]/strong/text()').extract_first()
        anime_loader.add_value("title", title)
        score = response.xpath('//div[contains(@class,"score-label")]/text()').extract_first()
        anime_loader.add_value("avg_score", score)
        non_normal_description = response.xpath("//p[@itemprop='description']")
        normalized_description = non_normal_description.xpath("normalize-space(.)").extract_first()
        anime_loader.add_value("description", normalized_description.strip())

        languages_path = response.xpath('//*[preceding-sibling::h2[.="Alternative Titles"] and following-sibling::h2[. = "Information"]]/../div[@class="spaceit_pad"]')
        languages = {}
        for language in languages_path:
            key = language.xpath("./span/text()").extract_first().replace(":","")
            value = "".join(language.xpath("./text()").extract()).strip()
            languages[key] = value
        anime_loader.add_value("alt_names", languages)

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
                    hold_dates["end"] = "?"
            elif key == "Premiered":
                anime_loader.add_value("season", value)
            elif key == "Broadcast":
                time = [x.strip() for x in value.split("at")]
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
                clean_duration = value.replace("per ep.","").strip()
                anime_loader.add_value("duration", clean_duration)
            elif key == "Rating":
                anime_loader.add_value("rating", value)

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

        for container in info_containers:
            staff_loader = ItemLoader(item = StaffItem())
            character_staff = container.xpath("./tr/td")
            character_staff_image_url = character_staff[0].xpath(".//img/@data-src").extract_first()
            character_staff_name = character_staff[1].xpath("./a/text()").extract_first()
            character_staff_role = character_staff[1].xpath(".//div[@class='spaceit_pad']/small/text()").extract_first()
            character_staff_type = "staff"

            if len(character_staff ) == 3:
                character_loader = ItemLoader(item = CharacterItem())
                actor_loader = ItemLoader(item = ActorItem())
                character_staff_type = "character"
                all_actors = character_staff[2].xpath(".//tr")

                character_loader.add_value("name", character_staff_name)
                character_loader.add_value("image_url", character_staff_image_url)
                character_loader.add_value("role", character_staff_role)
                character_loader.add_value("anime", anime_title)
                yield character_loader.load_item() 

                for actor in all_actors:
                    actor_data = actor.xpath(".//td")
                    actor_name = actor_data[0].xpath(".//a/text()").extract_first()
                    actor_language = actor_data[0].xpath(".//small/text()").extract_first()
                    actor_image = actor_data[1].xpath(".//img/@data-src").extract_first()

                    actor_loader.add_value("name", actor_name)
                    actor_loader.add_value("image_url", actor_image)
                    actor_loader.add_value("actor_language", actor_language)
                    actor_loader.add_value("anime", anime_title)
                    actor_loader.add_value("character", character_staff_name)
                    actor_loader.add_value("character_image_url", character_staff_image_url)

                    yield actor_loader.load_item()

            else:
                staff_loader.add_value("name", character_staff_name)
                staff_loader.add_value("image_url", character_staff_image_url)
                staff_loader.add_value("role", character_staff_role)
                staff_loader.add_value("anime", anime_title)
                yield staff_loader.load_item()


def set_date(date=None, time=None):
    try:
        date_str = date + " " + time
        date_time_obj = datetime.datetime.strptime(date_str, "%b %d, %Y %H:%M")
        japan_tz = pytz.timezone("Asia/Tokyo")
        jp_local_dt = japan_tz.localize(date_time_obj)
        utc_time = jp_local_dt.astimezone(pytz.utc)
        return utc_time
    except Exception:
        return "?"