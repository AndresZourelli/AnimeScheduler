import psycopg2
import json

# conn = psycopg2.connect(
#     "host=localhost dbname=anime user=admin password=admin port=5433")
# curr = conn.cursor()


def convertJSON(item):
    print(cleanString(item["genres"]))


def cleanString(string):
    arr = string.split(",")
    result = []
    for item in arr:
        result.append(" ".join(item.split()))
    return result


with open("anime.json") as f:
    data = json.load(f)


count = 0
for key in data:

    print(data[key])
    if count == 5:
        # convertJSON(data[key])
        break
    count += 1

# print(count)
