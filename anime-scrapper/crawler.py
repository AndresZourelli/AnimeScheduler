import requests
from bs4 import BeautifulSoup, NavigableString
import json
import time
import datetime


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def write_json(data, filename='anime.json'):
    with open(filename, 'w+') as f:
        json.dump(data, f, indent=4)


def searchAnimePage(URL):
    information = {}
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    score = soup.find("div", {"class": "score-label"}).text
    information["score"] = score
    try:
        description = soup.find("p", {"itemprop": "description"}).text
        description = description
    except Exception as identifier:
        description = "None"
    information['description'] = description.replace(
        "\n", "").replace("\r", "").strip()

    altNames = {}
    try:
        otherNames = soup.find('td', {"class": "borderClass"})
        otherNames = otherNames.findAll('div', {"class": "spaceit_pad"})
    except Exception as identifier:
        otherNames = "None"
    for item in otherNames:
        titleVersion = item.find('span', {"class": "dark_text"}).text
        [tag.extract() for tag in item.findAll('span', {"class": "dark_text"})]
        name = item.text.replace("\n", "").replace("\r", "").strip()
        altNames[titleVersion] = name.replace("\n", "").strip()
    information["names"] = altNames

    find_image = soup.find('td', {"class": "borderClass"}).find("img")[
        'data-src']

    information["image_url"] = find_image

    html = u""
    count = 0
    for tag in (soup.find('td', {"class": "borderClass"}).find("h2").next_siblings):
        if tag.name == "h2" and count == 1:
            break
        else:
            if tag.name == "h2" and tag.text == "Information":
                count += 1
            elif tag.name == "h2" and tag.text == "Statistics":
                break
            else:
                html += str(tag)

    html = BeautifulSoup(html, 'html.parser')
    for element in html.findAll('div'):
        try:
            elementTitle = element.find(
                'span', {"class": "dark_text"}).text.replace(":", "").lower()
            [tag.extract() for tag in element.findAll(
                'span')]

            elementInfo = element.text.replace(
                "\n", "").replace("\r", "").strip()
            if elementTitle in ["producers", "licensors", "genres", "studios"]:
                elementInfo = elementInfo.split(",")
                for i in range(len(elementInfo)):
                    elementInfo[i] = elementInfo[i].strip()

            information[elementTitle] = elementInfo
        except Exception as NavigableString:
            pass
    return information


def searchSeasonalAnime(URLLink):
    page = requests.get(URLLink)
    soup = BeautifulSoup(page.content, 'html.parser')

    table = soup.find("div", {"class": "js-categories-seasonal"})
    rows = table.findAll("tr")[1:]
    for row in rows:
        cells = row.findAll('td')
        img = cells[0].find('img')
        title = cells[1].find('strong')
        print(title)
        description = cells[1].find("div", {"class": "pt4"})
        link = cells[1].find("a")["href"]
        information = searchAnimePage(link)
        information['title'] = title.text
        # print(bcolors.OKBLUE, information, bcolors.ENDC)
        with open('anime.json') as json_file:
            data = json.load(json_file)
            temp = data["anime"]
            if title.text not in data:
                temp.append(information)
        write_json(data)


def searchTopAnime(URLLink):
    page = requests.get(URLLink)
    soup = BeautifulSoup(page.content, 'html.parser')
    table = soup.find("table", {"class": "top-ranking-table"})
    rows = table.findAll("tr", {"class": "ranking-list"})
    for i in range(len(rows)):
        # image_link_container = rows[i].find(
        #     "a", {"class": "hoverinfo_trigger"})
        # image = image_link_container.find("img")["data-src"]

        title_container = rows[i].find("div", {"class": "di-ib"})
        title = title_container.find("a").text
        href = rows[i].find("a")["href"]
        information = searchAnimePage(href)
        information["title"] = title
        # information["image_url"] = image
        with open('anime.json') as json_file:
            data = json.load(json_file)
            # temp = data["anime"]
            if title not in data:
                data[title] = information
            # temp.append(information)
        write_json(data)
        print(title)
        time.sleep(10)


def getPages(url):
    print(url)
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    allPages = soup.find('span', {"class": "bgColor1"})
    numOfPages = allPages.findAll('a')
    return len(numOfPages)


def main():
    URL = 'https://myanimelist.net/anime.php?letter=.'
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    getNav = soup.find('div', {"id": "horiznav_nav"})
    getLetters = getNav.findAll("a")[2:]
    letters = []
    for i in range(len(getLetters)):
        letters.append(getLetters[i].text)
    letters[0] = "."
    splitURL = URL.split('?')
    baseURL = splitURL[0]
    data = []
    for i in range(len(letters)):
        tempURL = baseURL + '?letter=' + letters[i]
        pageNum = getPages(tempURL)
        show = 0
        for i in range(pageNum):
            tempURL += f"&show={str(show)}"
            searchAllAnime(tempURL)
            show += 50


def getTopAnime():
    baseURL = "https://myanimelist.net/topanime.php"
    limit = 0
    while limit <= 3000:
        now = datetime.datetime.now()
        timeString = now.strftime("%Y-%m-%d %H:%M:%S")
        with open("log.txt", "a") as logFile:
            logFile.write(
                f"{timeString}: Item numbers {str(limit)}-{str(limit+50)}\n")

        URL = baseURL + f"?limit={str(limit)}"
        print(bcolors.OKGREEN,
              f"Item numbers {str(limit)}-{str(limit+50)}", timeString, bcolors.ENDC)
        searchTopAnime(URL)
        limit += 50


if __name__ == "__main__":
    getTopAnime()
