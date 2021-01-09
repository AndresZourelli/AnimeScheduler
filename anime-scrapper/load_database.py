import psycopg2
import json

conn = psycopg2.connect(
    "host=localhost dbname=anime user=admin password=admin port=5433")
curr = conn.cursor()

sql_create_table_genre = """
    CREATE TABLE IF NOT EXISTS genres (
        genre_id serial PRIMARY KEY,
        genre_name text NOT NULL UNIQUE
        );
"""

sql_create_table_rating = """
    CREATE TABLE IF NOT EXISTS ratings (
        rating_id serial PRIMARY KEY,
        rating_name text NOT NULL UNIQUE
    );
"""

sql_create_table_type = """
    CREATE TABLE IF NOT EXISTS types (
        type_id serial PRIMARY KEY,
        type_name text NOT NULL UNIQUE
    );
"""

sql_create_table_statuses = """
    CREATE TABLE IF NOT EXISTS statuses (
        status_id serial PRIMARY KEY,
        status_name text NOT NULL UNIQUE
    );
"""

sql_create_table_season = """
    CREATE TABLE IF NOT EXISTS seasons (
        season_id serial PRIMARY KEY,
        season_date text UNIQUE
    );
"""
sql_create_table_source = """
    CREATE TABLE IF NOT EXISTS sources (
        source_id serial PRIMARY KEY,
        source_name text UNIQUE
    );
"""

sql_create_table_anime = """
    CREATE TABLE IF NOT EXISTS animes (
        anime_id serial PRIMARY KEY,
        title text NOT NULL ,
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
        FOREIGN KEY (fk_type) REFERENCES types (type_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_season) REFERENCES seasons (season_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_source) REFERENCES sources (source_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_status) REFERENCES statuses (status_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_rating) REFERENCES ratings (rating_id) ON UPDATE CASCADE ON DELETE CASCADE
    
    )
"""

sql_create_table_genre_anime = """
    CREATE TABLE IF NOT EXISTS genres_animes (
        genre_id serial PRIMARY KEY,
        fk_genre_id integer,
        fk_anime_id integer,
        FOREIGN KEY (fk_genre_id) REFERENCES genres (genre_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""

sql_create_table_alt_names = """
    CREATE TABLE IF NOT EXISTS alt_names (
        alt_name_id serial PRIMARY KEY,
        fk_anime_id integer,
        alt_name text,
        FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""

sql_create_table_producers = """
    CREATE TABLE IF NOT EXISTS producers (
        producer_id serial PRIMARY KEY,
        producer_name text UNIQUE
    );
"""

sql_create_table_producers_anime = """
    CREATE TABLE IF NOT EXISTS producers_animes (
        producer_anime_id serial PRIMARY KEY,
        fk_anime_id integer,
        fk_producer_id integer,
        FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_producer_id) REFERENCES producers (producer_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""

sql_create_table_licensors = """
    CREATE TABLE IF NOT EXISTS licensors (
        licensor_id serial PRIMARY KEY,
        licensor_name text UNIQUE
    );
"""

sql_create_table_licensors_anime = """
    CREATE TABLE IF NOT EXISTS licensors_animes (
        licensor_anime_id serial PRIMARY KEY,
        fk_licensor_id integer,
        fk_anime_id integer,
        FOREIGN KEY (fk_licensor_id) REFERENCES licensors (licensor_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""

sql_create_table_studios = """
    CREATE TABLE IF NOT EXISTS studios (
        studio_id serial PRIMARY KEY,
        studio_name text UNIQUE
    );
"""

sql_create_table_studios_anime = """
    CREATE TABLE IF NOT EXISTS studios_animes (
        studios_anime_id serial PRIMARY KEY,
        fk_anime_id integer,
        fk_studios_id integer,
        FOREIGN KEY (fk_anime_id) REFERENCES animes (anime_id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_studios_id) REFERENCES studios (studio_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
"""


def create_database(cursor):
    if cursor is not None:
        cursor.execute(sql_create_table_genre)
        cursor.execute(sql_create_table_source)
        cursor.execute(sql_create_table_rating)
        cursor.execute(sql_create_table_season)
        cursor.execute(sql_create_table_statuses)
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
    conn.commit()
    conn.close()


def parse_data(data):
    if curr is not None:

        get_episodes = [int(s)
                        for s in data["episodes"].split() if s.isdigit()]

        if data["duration"] == "Unknown":
            get_duration = None
        else:
            get_duration = [int(s)
                            for s in data["duration"].split() if s.isdigit()][0]

        get_aired_start = data["aired"].split("to")[0].strip()

        if "?" in get_aired_start:
            get_aired_start = None

        get_aired_end = None
        if len(data["aired"].split("to")) > 1:
            get_aired_end = data["aired"].split("to")[1].strip()

        if get_aired_end and "?" in get_aired_end:
            get_aired_end = None

        get_broadcast_day = None
        get_broadcast_time = None
        if "broadcast" in data:
            broadcast = [s.strip()
                         for s in data["broadcast"].split(" at ")]
            get_broadcast_day = "".join(broadcast[0])
            if len(broadcast) > 1:
                get_broadcast_time = "".join(broadcast[1])
        # add anime info that doesnt need other tables
        # print((float(data["score"]), data["description"], data["image_url"], get_episodes[0],
        #        get_duration, get_aired_start, get_aired_end, get_broadcast_day, get_broadcast_time))
        if len(get_episodes) == 0:
            get_episodes = None
        else:
            get_episodes = get_episodes[0]

        if get_broadcast_time == "Unknown":
            get_broadcast_time = None

        curr.execute(
            "INSERT INTO animes (score, description, image_url, episodes, title, duration, aired_start, aired_end, broadcast_day, broadcast_time ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING anime_id", (float(data["score"]), data["description"], data["image_url"], get_episodes, data["title"], get_duration, get_aired_start, get_aired_end, get_broadcast_day, get_broadcast_time))
        anime_id = curr.fetchone()
        anime_id = anime_id[0]

        # add type
        curr.execute(
            "INSERT INTO types (type_name) VALUES (%s) ON CONFLICT (type_name) DO NOTHING", (data["type"],))

        # add status
        curr.execute(
            "INSERT INTO statuses (status_name) VALUES (%s) ON CONFLICT (status_name) DO NOTHING", (data["status"],))

        # add season
        premiered = None
        if "premiered" in data:
            premiered = data["premiered"]
        curr.execute(
            "INSERT INTO seasons (season_date) VALUES (%s) ON CONFLICT (season_date) DO NOTHING", (premiered,))

        # add source
        curr.execute(
            "INSERT INTO sources (source_name) VALUES (%s) ON CONFLICT (source_name) DO NOTHING", (data["source"],))

        # add rating
        curr.execute(
            "INSERT INTO ratings (rating_name) VALUES (%s) ON CONFLICT (rating_name) DO NOTHING", (data["rating"],))

        # add names
        for name_arr in data["names"]:
            name_arr = name_arr.split(",")
            for name in name_arr:
                curr.execute(
                    "INSERT INTO alt_names (fk_anime_id, alt_name) VALUES (%s,%s)", (anime_id, name))

        # add producers
        for producer in data["producers"]:
            curr.execute(
                "INSERT INTO producers (producer_name) VALUES ( %s)  ON CONFLICT (producer_name) DO NOTHING RETURNING producer_id", (producer,))
            curr.execute(
                "SELECT producer_id FROM producers WHERE producer_name = (%s)", (producer,))
            producer_id = curr.fetchone()[0]
            curr.execute(
                "INSERT INTO producers_animes (fk_anime_id, fk_producer_id) VALUES (%s, %s)", (anime_id, producer_id))

        # add licensors
        for licensor in data["licensors"]:
            curr.execute(
                "INSERT INTO licensors (licensor_name) VALUES (%s)  ON CONFLICT (licensor_name) DO NOTHING RETURNING licensor_id",  (licensor,))
            curr.execute(
                "SELECT licensor_id FROM licensors WHERE licensor_name = (%s)", (licensor,))
            licensor_id = curr.fetchone()[0]
            curr.execute(
                "INSERT INTO licensors_animes (fk_anime_id, fk_licensor_id) VALUES (%s, %s)", (anime_id, licensor_id))

        # add studios
        for studio in data["studios"]:
            curr.execute(
                "INSERT INTO studios (studio_name) VALUES ( %s) ON CONFLICT (studio_name) DO NOTHING RETURNING studio_id ", (
                    studio,))
            curr.execute(
                "SELECT studio_id FROM studios WHERE studio_name = (%s)", (studio,))
            studio_id = curr.fetchone()[0]
            curr.execute(
                "INSERT INTO studios_animes (fk_anime_id, fk_studios_id) VALUES (%s, %s)", (anime_id, studio_id))

        # add genres

        for genre in data["genres"]:
            curr.execute(
                "INSERT INTO genres ( genre_name) VALUES ( %s)  ON CONFLICT (genre_name) DO NOTHING",  (genre,))
            curr.execute(
                "SELECT genre_id FROM genres WHERE genre_name = (%s)", (genre,))
            genre_id = curr.fetchone()[0]
            curr.execute(
                "INSERT INTO genres_animes (fk_anime_id, fk_genre_id) VALUES (%s, %s)", (anime_id, genre_id))

        # add rest of anime info
        curr.execute(
            "SELECT type_id FROM types WHERE type_name = (%s)", (data["type"],))
        type_id = curr.fetchone()[0]

        curr.execute(
            "SELECT season_id FROM seasons WHERE season_date = (%s)", (premiered,))
        premiered_id = curr.fetchone()
        if premiered_id and len(premiered_id) >= 1:
            premiered_id = premiered_id[0]
        else:
            premiered_id = None

        curr.execute(
            "SELECT source_id FROM sources WHERE source_name = (%s)", (data["source"],))
        source_id = curr.fetchone()[0]

        curr.execute(
            "SELECT status_id FROM statuses WHERE status_name = (%s)", (data["status"],))
        status_id = curr.fetchone()[0]

        curr.execute(
            "SELECT rating_id FROM ratings WHERE rating_name = (%s)", (data["rating"],))
        rating_id = curr.fetchone()[0]

        curr.execute("UPDATE animes SET fk_type=%s, fk_season=%s, fk_source=%s, fk_status=%s, fk_rating=%s WHERE anime_id=%s",
                     (type_id, premiered_id, source_id, status_id, rating_id, anime_id))


def load_data(curr):
    with open("anime.json") as f:
        data = json.load(f)

    if curr is not None:
        for key in data:
            parse_data(data[key])
    conn.commit()
    conn.close()


if __name__ == "__main__":
    # create_database(curr)
    load_data(curr)


# count = 0
# for key in data:

#     print(data[key])
#     if count == 5:
#         # convertJSON(data[key])
#         break
#     count += 1

# print(count)
