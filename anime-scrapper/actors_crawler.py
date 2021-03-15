import requests
from bs4 import BeautifulSoup
import json
import time
import datetime
import os
import re

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def getTopAnime():
    baseURL = "https://myanimelist.net/topanime.php"
    limit = 0
    while limit <= 2:
        now = datetime.datetime.now()
        timeString = now.strftime("%Y-%m-%d %H:%M:%S")
        with open("actor_log.txt", "a") as logFile:
            logFile.write(
                f"{timeString}: Item numbers {str(limit)}-{str(limit+50)}\n")

        URL = baseURL + f"?limit={str(limit)}"
        print(bcolors.OKGREEN,
              f"Item numbers {str(limit)}-{str(limit+50)}", timeString, bcolors.ENDC)
        getActors(URL)
        limit += 50


def write_json(data, filename='actor.json'):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

def getActors(URL):
    topAnimePage = requests.get(URL)
    topPageSoup = BeautifulSoup(topAnimePage.content, 'html5lib')
    table = topPageSoup.find("table", {"class": "top-ranking-table"})
    rows = table.findAll("tr", {"class": "ranking-list"})
    for i in range(len(rows)):
        title_container = rows[i].find("div", {"class": "di-ib"})
        title = title_container.find("a").text
        animeLink = rows[i].find("a")["href"]
        characterPage = animeLink + "/characters"
        information = getCharactersPage(characterPage)
        information["title"] = title
        # with open('anime.json') as json_file:
        #     data = json.load(json_file)
        #     # temp = data["anime"]
        #     if title not in data:
        #         data[title] = information
        #     # temp.append(information)
        # write_json(data)
        print(title)
        time.sleep(10)
    
def getCharactersPage(URL):
    characters = []
    actors = []
    page = requests.get(URL)
    characterSoup = BeautifulSoup(page.content, "html.parser")
    parent_nav = characterSoup.find("div",{"id":"content"})
    content = parent_nav.find("div","js-scrollfix-bottom-rel").parent
    tables = content.find_all("table")
    for element in tables:
        character = {}
        actor = {}
        imageCell = element.find_all("td")[0]
        characterCell = element.find_all("td")[1]
        actorCell = element.find_all("td")[2]
        name = characterCell.find("a").text
        name  = name.split(", ")
        print(name)
        fixedName = " ".join([name[1],name[0]])
        character["name"] = fixedName
        character["role"] = characterCell.find("small").text
        character["image"] = imageCell.find("img")['data-src']
        character["actor"] = actorCell.find("a").text
        character["actorLanguage"] = actorCell.find("small").text
        actorLink = actorCell.find("a")["href"]
        characterLink = characterCell.find("a")["href"]
        print(characterLink)
        characters.append(character)
        actors.append(actor)
        getCharacter(characterLink)
         

    with open("test.html","w") as file:
        file.write(str(tables))

def getCharacter(URL):
    character = {}
    page = requests.get(URL)
    characterSoup = BeautifulSoup(page.content, "html5lib")
    content = characterSoup.find("div",{"id":"content"}).find("table").find("tr")
    cells = content.find_all("td", recursive=False)
    characterInfo = cells[1]
    name = characterInfo.find("h2")
    japaneseName = name.find("small")
    if(japaneseName):
        japaneseName = japaneseName.text
    name.span.decompose()
    name = name.text
    character["name"] = name
    character["japaneseName"] = japaneseName
    characterData = characterSoup.select_one("#content > table > tbody > tr > td:nth-child(2)")
    for x in characterData.find_all(): 
    # fetching text from tag and remove whitespaces 
        if len(x.get_text(strip=True)):         
        # Remove empty tag 
            x.extract()
    description = re.sub(r' +', ' ', characterData.get_text())
    description = re.sub(r'\n\s*\n', '\n', description)
    description = description.replace("\xa0", " ")
    print("hello",repr(description.splitlines()))

    # with open('character.json',"w") as json_file:
    #     if not os.path.exists("./character.json"):
    #         json.dump({},json_file)


    # with open('character.json') as json_file:
    #         data = json.load(json_file)
    #         # temp = data["anime"]
    #         if name not in data:
    #             data[name] = character


if __name__ == "__main__":
    getTopAnime()