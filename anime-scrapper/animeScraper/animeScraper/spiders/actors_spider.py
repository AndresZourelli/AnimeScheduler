from scrapy.loader import ItemLoader
import scrapy
from animeScraper.items import ActorItem, StaffItem, CharacterItem, AnimeItem

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
            # yield response.follow(anime_link, callback=self.anime_page_parse)

            character_page_link = anime_link + "/characters"
            yield response.follow(character_page_link, callback=self.character_page_parse)
            self.count += 1

        next_page = response.css("a.link-blue-box.next::attr(href)").get()
        if next_page is not None and self.count <= self.COUNT_MAX:
            yield response.follow(next_page, callback=self.parse)

    def anime_page_parse(self, response):
        pass

    def character_page_parse(self, response):
        info_containers = response.xpath('//div[@id="content"]//div[@class="js-scrollfix-bottom-rel"]/table[@border="0" and @cellpadding="0" and @cellspacing="0" and @width="100%" ]')
        anime_title = response.xpath("//h1[@class='title-name h1_bold_none']/strong/text()").extract_first()
        
        anime_loader = ItemLoader(item=AnimeItem())
        anime_loader.add_value("title", anime_title)
        yield anime_loader.load_item()

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

                    yield actor_loader.load_item()

                    if actor_language == "Japanese":
                        character_loader.add_value("actor", actor_name)
            
                character_loader.add_value("name", character_staff_name)
                character_loader.add_value("image_url", character_staff_image_url)
                character_loader.add_value("role", character_staff_role)
                character_loader.add_value("anime", anime_title)

                yield character_loader.load_item() 

            else:
                staff_loader.add_value("name", character_staff_name)
                staff_loader.add_value("image_url", character_staff_image_url)
                staff_loader.add_value("role", character_staff_role)
                staff_loader.add_value("anime", anime_title)

                yield staff_loader.load_item()