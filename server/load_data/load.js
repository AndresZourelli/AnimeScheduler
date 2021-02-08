const fs = require("fs");

const Anime = require("../mongoDB/models/anime");
const Genre = require("../mongoDB/models/genre");
const Rating = require("../mongoDB/models/rating");
const Season = require("../mongoDB/models/season");
const Source = require("../mongoDB/models/source");
const Status = require("../mongoDB/models/status");
const Producer = require("../mongoDB/models/producer");
const Licensor = require("../mongoDB/models/licensor");
const Studio = require("../mongoDB/models/studio");

const genre_anime = require("../mongoDB/models/genre_anime");
const licensor_anime = require("../mongoDB/models/licensor_anime");
const producer_anime = require("../mongoDB/models/producer_anime");
const studio_anime = require("../mongoDB/models/studio_anime");

const momenttz = require("moment-timezone");

require("dotenv").config({ path: "../" });
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/animeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

let raw_data = fs.readFileSync("../../anime-scrapper/anime.json");
let data = JSON.parse(raw_data);

let i = 0;
const func = async () => {
  console.log("Start");
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const anime = await Anime.findOneAndUpdate(
        { title: key },
        {
          title: key,
          description: data[key].description,
          image_url: data[key].image_url,
          episodes: parseInt(data[key].episodes) || null,
          status: data[key].status,
          aired_start: data[key].aired?.split("to")[0]?.trim() ?? "Unknown",
          aired_end: data[key].aired?.split("to")[1]?.trim() ?? "Unknown",
          broadcast_day:
            data[key].broadcast?.split("at")[0]?.trim() ?? "Unknown",
          broadcast_time:
            data[key].broadcast?.split("at")[1]?.trim() ?? "Unknown",
          duration: data[key].duration,
          type: data[key].type,
          season: data[key].season,
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
        },
        { upsert: true }
      );

      const genres = await Promise.all(
        data[key].genres.map(async (genre) => {
          await Genre.findOneAndUpdate(
            { genre_name: genre },
            { genre_name: genre },
            { upsert: true }
          );
        })
      );

      const producer = await Promise.all(
        data[key].producers.map(async (producer) => {
          await Producer.findOneAndUpdate(
            { producer_name: producer },
            { producer_name: producer },
            { upsert: true }
          );
        })
      );

      const studio = await Promise.all(
        data[key].studios.map(async (studio) => {
          await Studio.findOneAndUpdate(
            { studio_name: studio },
            { studio_name: studio },
            { upsert: true }
          );
        })
      );

      const licensor = await Promise.all(
        data[key].licensors.map(async (licensor) => {
          await Licensor.findOneAndUpdate(
            { licensor_name: licensor },
            { licensor_name: licensor },
            { upsert: true }
          );
        })
      );

      await Rating.findOneAndUpdate(
        { rating_name: data[key].rating },
        { rating_name: data[key].rating },
        { upsert: true }
      );

      await Season.findOneAndUpdate(
        { season_name: data[key].premiered },
        { season_name: data[key].premiered },
        { upsert: true }
      );

      await Source.findOneAndUpdate(
        { source_name: data[key].source },
        { source_name: data[key].source },
        { upsert: true }
      );

      await Status.findOneAndUpdate(
        { status_name: data[key].status },
        { status_name: data[key].status },
        { upsert: true }
      );
    }

    // if (i == 5) {
    //   break;
    // }
    i++;
  }
  console.log("Done");
};

func();
