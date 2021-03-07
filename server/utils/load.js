/*eslint-disable*/
const fs = require("fs");
const momenttz = require("moment-timezone");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../" });

const Anime = require("../mongoDB/models/anime");
const Genre = require("../mongoDB/models/genre");
const Rating = require("../mongoDB/models/rating");
const Season = require("../mongoDB/models/season");
const Source = require("../mongoDB/models/source");
const Status = require("../mongoDB/models/status");
const Producer = require("../mongoDB/models/producer");
const Licensor = require("../mongoDB/models/licensor");
const Studio = require("../mongoDB/models/studio");

mongoose.connect("mongodb://localhost:27017/animeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const raw_data = fs.readFileSync("../../anime-scrapper/anime.json");
const data = JSON.parse(raw_data);

const func = async () => {
  console.log("Start");
  const promise = [];
  Object.keys(data).forEach(async (key) => {
    const anime = Anime.findOneAndUpdate(
      { title: key },
      {
        title: key,
        description: data[key].description,
        image_url: data[key].image_url,
        episodes: parseInt(data[key].episodes) || null,
        avg_score: parseFloat(data[key].score),
        status: data[key].status,
        aired_start: getDate(
          data[key].aired?.split("to")[0]?.trim(),
          data[key].broadcast?.split("at")[1]?.trim()
        ),
        aired_end: getDate(
          data[key].aired?.split("to")[1]?.trim(),
          data[key].broadcast?.split("at")[1]?.trim()
        ),
        broadcast_day: data[key].broadcast?.split("at")[0]?.trim() ?? null,
        broadcast_time: data[key].broadcast?.split("at")[1]?.trim() ?? null,
        duration: data[key].duration,
        type: data[key].type,
        season: data[key].premiered,
        source: data[key].source,
        rating: data[key].rating,
        alt_names: {
          English: data[key].names?.["English:"],
          Synonyms: data[key].names?.["Synonyms:"],
          Japanese: data[key].names?.["Japanese:"],
        },
        genres: data[key].genres,
        studios: data[key].studios,
        producers: data[key].producers,
        licensors: data[key].licensors,
        minutes_watched: 0,
      },
      { upsert: true }
    );

    promise.push(anime);

    const genres = data[key].genres.map(async (genre) =>
      Genre.findOneAndUpdate(
        { genre_name: genre },
        { genre_name: genre },
        { upsert: true }
      )
    );
    promise.push(genres);

    const producers = data[key].producers.map(async (producer) =>
      Producer.findOneAndUpdate(
        { producer_name: producer },
        { producer_name: producer },
        { upsert: true }
      )
    );
    promise.push(producers);

    const studios = data[key].studios.map(async (studio) =>
      Studio.findOneAndUpdate(
        { studio_name: studio },
        { studio_name: studio },
        { upsert: true }
      )
    );
    promise.push(studios);

    const licensors = data[key].licensors.map(async (licensor) =>
      Licensor.findOneAndUpdate(
        { licensor_name: licensor },
        { licensor_name: licensor },
        { upsert: true }
      )
    );

    promise.push(licensors);

    const ratings = Rating.findOneAndUpdate(
      { rating_name: data[key].rating },
      { rating_name: data[key].rating },
      { upsert: true }
    );

    promise.push(ratings);

    const seasons = Season.findOneAndUpdate(
      { season_name: data[key].premiered },
      { season_name: data[key].premiered },
      { upsert: true }
    );

    promise.push(seasons);

    const sources = Source.findOneAndUpdate(
      { source_name: data[key].source },
      { source_name: data[key].source },
      { upsert: true }
    );
    promise.push(sources);

    const statuses = Status.findOneAndUpdate(
      { status_name: data[key].status },
      { status_name: data[key].status },
      { upsert: true }
    );
    promise.push(statuses);
  });

  await Promise.all(promise);
  console.log("Done");
};

const getDate = (dateString, time) => {
  const convertedDate = momenttz.tz(
    `${dateString} ${time?.replace("(JST)", "")}`,
    "MMM DD, YYYY HH:mm",
    "Asia/Tokyo"
  );
  if (convertedDate.isValid()) {
    return convertedDate;
  }
  return null;
};

func();
