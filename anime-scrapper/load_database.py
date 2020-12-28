import psycopg2
import json

conn = psycopg2.connect(
    "host=localhost dbname=anime user=admin password=admin port=5433")
curr = conn.cursor()

sql_create_table_genre = """ 
    CREATE TABLE IF NOT EXISTS genre (
        genre_id integer PRIMARY KEY,
        cat_name text NOT NULL
        );
"""

sql_create_table_rating = """ 
    CREATE TABLE IF NOT EXISTS rating (
        rating_id integer PRIMARY KEY,
        rating_type text NOT NULL
    );
"""

sql_create_table_type = """
    CREATE TABLE IF NOT EXISTS type (
        type_id integer PRIMARY KEY,
        type_name text NOT NULL 
    );
"""

sql_create_table_status = """
    CREATE TABLE IF NOT EXISTS status (
        status_id integer PRIMARY KEY,
        status_type text NOT NULL
    );
"""

sql_create_table_season = """
    CREATE TABLE IF NOT EXISTS season (
        season_id integer PRIMARY KEY,
        season_date text
    );
"""
sql_create_table_source = """
    CREATE TABLE IF NOT EXISTS source (
        source_id integer PRIMARY KEY,
        source_name text
    );
"""

sql_create_table_anime = """ 
    CREATE TABLE IF NOT EXISTS anime (
        anime_id integer PRIMARY KEY,
        title text NOT NULL,
        score decimal NOT NULL,
        description text NOT NULL,
        image_url text,
        episodes integer,
        aired_start date,
        aired_end date,
        broadcast_day text,
        broadcast_time time,
        duration integer,
        fk_type integer,
        fk_season integer,
        fk_source integer,
        fk_status integer,
        fk_rating integer,
        FOREIGN KEY (fk_type) REFERENCES type (type_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_season) REFERENCES season (season_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_source) REFERENCES source (source_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_status) REFERENCES status (status_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_rating) REFERENCES rating (rating_id) ON UPDATE CASCADE ON DELETE CASCADE
    )
"""

sql_create_table_genre_anime = """
    CREATE TABLE IF NOT EXISTS genres_anime (
        genre_id integer PRIMARY KEY,
        fk_genre integer,
        fk_anime integer,
        FOREIGN KEY (fk_genre) REFERENCES genre (genre_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_anime) REFERENCES anime (anime_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""

sql_create_table_alt_names = """
    CREATE TABLE IF NOT EXISTS alt_names (
        alt_name_id integer PRIMARY KEY,
        fk_anime integer,
        alt_name text,
        FOREIGN KEY (fk_anime) REFERENCES anime (anime_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""

sql_create_table_producers = """ 
    CREATE TABLE IF NOT EXISTS producers (
        producer_id integer PRIMARY KEY,
        producer_name text
    );
"""

sql_create_table_producers_anime = """ 
    CREATE TABLE IF NOT EXISTS producers_anime (
        producer_anime_id integer PRIMARY KEY,
        fk_anime_id integer,
        fk_producer_id integer,
        FOREIGN KEY (fk_anime_id) REFERENCES anime (anime_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_producer_id) REFERENCES producers (producer_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""

sql_create_table_licensors = """ 
    CREATE TABLE IF NOT EXISTS licensors (
        licensor_id integer PRIMARY KEY,
        licensor_name text
    );
"""

sql_create_table_licensors_anime = """ 
    CREATE TABLE IF NOT EXISTS licensors_anime (
        licensor_anime_id integer PRIMARY KEY,
        fk_licensor_id integer,
        fk_anime_id integer,
        FOREIGN KEY (fk_licensor_id) REFERENCES licensors (licensor_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_anime_id) REFERENCES anime (anime_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""

sql_create_table_studios = """ 
    CREATE TABLE IF NOT EXISTS studios (
        studio_id integer PRIMARY KEY,
        studio_name text
    );
"""

sql_create_table_studios_anime = """ 
    CREATE TABLE IF NOT EXISTS studios_anime (
        studios_anime_id integer PRIMARY KEY,
        fk_anime_id integer,
        fk_studios_id integer,
        FOREIGN KEY (fk_anime_id) REFERENCES anime (anime_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_studios_id) REFERENCES studios (studio_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""


def create_database(cursor):
    if cursor is not None:
        cursor.execute(sql_create_table_genre)
        cursor.execute(sql_create_table_source)
        cursor.execute(sql_create_table_rating)
        cursor.execute(sql_create_table_season)
        cursor.execute(sql_create_table_status)
        cursor.execute(sql_create_table_type)
        cursor.execute(sql_create_table_anime)
        cursor.execute(sql_create_table_genre_anime)
        cursor.execute(sql_create_table_alt_names)
        cursor.execute(sql_create_table_producers)
        cursor.execute(sql_create_table_producers_anime)
        cursor.execute(sql_create_table_licensors)
        cursor.execute(sql_create_table_licensors_anime)
        cursor.execute(sql_create_table_studios)
        cursor.execute(sql_create_table_studios_anime)


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

create_database(curr)
conn.commit()
conn.close()

# count = 0
# for key in data:

#     print(data[key])
#     if count == 5:
#         # convertJSON(data[key])
#         break
#     count += 1

# print(count)
