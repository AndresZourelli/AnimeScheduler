const moment = require("moment");
const Anime = require("../db/models/animes/animes.model.js");
const { getAnime, getHighestRatedAnimes, getCurrentSeasons, getContinuedSeasons, getAnimePaths } = require("../db/models/animes/animes.queries")
const { formatErrors } = require("../utils/FormatError");
const db = require("../db/dbConfig");
const tableNames = require("../utils/constants/tableNames");

const animeResolver = {
  Anime: {
    genres: async parent => {
      const result = await db(tableNames.anime_genre).select(`${tableNames.genres}.genre_id`, `${tableNames.genres}.genre_name`).join(tableNames.genres, `${tableNames.anime_genre}.fk_genre_id`, `${tableNames.genres}.genre_id`).where(`${tableNames.anime_genre}.fk_anime_id`, "=", parent.anime_id)
      return result
    },
    licensors: async parent => {
      const result = await db(tableNames.anime_licensor).select(`${tableNames.licensors}.licensor_id`, `${tableNames.licensors}.licensor_name`).join(tableNames.licensors, `${tableNames.anime_licensor}.fk_licensor_id`, `${tableNames.licensors}.licensor_id`).where(`${tableNames.anime_licensor}.fk_anime_id`, "=", parent.anime_id)
      return result
    },
    producers: async parent => {
      const result = await db(tableNames.anime_producer).select(`${tableNames.producers}.producer_id`, `${tableNames.producers}.producer_name`).join(tableNames.producers, `${tableNames.anime_producer}.fk_producer_id`, `${tableNames.producers}.producer_id`).where(`${tableNames.anime_producer}.fk_anime_id`, "=", parent.anime_id)
      return result
    },
    studios: async parent => {
      const result = await db(tableNames.anime_studio).select(`${tableNames.studios}.studio_id`, `${tableNames.studios}.studio_name`).join(tableNames.studios, `${tableNames.anime_studio}.fk_studio_id`, `${tableNames.studios}.studio_id`).where(`${tableNames.anime_studio}.fk_anime_id`, "=", parent.anime_id)
      return result
    },
    characters: async parent => {
      const result = await db(tableNames.anime_character).select("*").join(tableNames.characters, `${tableNames.anime_character}.fk_character_id`, `${tableNames.characters}.character_id`).join(tableNames.character_images, `${tableNames.characters}.fk_character_primary_image`, `${tableNames.character_images}.character_image_id`).join(tableNames.images, `${tableNames.character_images}.fk_image_id`, `${tableNames.images}.image_id`).where(`${tableNames.anime_character}.fk_anime_id`, "=", parent.anime_id)
      return result
    },
    staff: async parent => {
      const result = await db(tableNames.anime_staff).select("*").join(tableNames.staff, `${tableNames.anime_staff}.fk_staff_id`, `${tableNames.staff}.staff_id`).join(tableNames.staff_images, `${tableNames.staff}.fk_staff_primary_image`, `${tableNames.staff_images}.staff_image_id`).join(tableNames.images, `${tableNames.staff_images}.fk_image_id`, `${tableNames.images}.image_id`).where(`${tableNames.anime_staff}.fk_anime_id`, "=", parent.anime_id)
      return result
    },
    actors: async parent => {
      const result = await db(tableNames.anime_actor).select("*").join(tableNames.actors, `${tableNames.anime_actor}.fk_actor_id`, `${tableNames.actors}.actor_id`).join(tableNames.images, `${tableNames.actors}.fk_actor_primary_image`, `${tableNames.images}.image_id`).where(`${tableNames.anime_actor}.fk_anime_id`, "=", parent.anime_id)
      return result
    },
  },
  Query: {
    getAnimes: async (_, args) => {
      const { search = null, page = 1, limit = 20 } = args;
      let searchQuery = {};

      if (search) {
        searchQuery = {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { "alt_names.English": { $regex: search, $options: "i" } },
            { "alt_names.Synonyms": { $regex: search, $options: "i" } },
            { "alt_names.Japanese": { $regex: search, $options: "i" } },
            { genres: { $regex: search, $options: "i" } },
            { licensors: { $regex: search, $options: "i" } },
            { producers: { $regex: search, $options: "i" } },
            { studios: { $regex: search, $options: "i" } },
            { season: { $regex: search, $options: "i" } },
            { source: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
          ],
        };
      }
      const animes = await Anime.query()
      return {
        animes: animes.results,
        totalPages: 0,
        currentPage: 0,
      };
    },
    getAnime: async (_, { anime_id }) => {
      const result = await getAnime(anime_id);
      return result;
    },
    getAnimeHighestRated: async (_, { page = 0, limit = 20 }) => {
      const animes = await getHighestRatedAnimes(limit, page)

      return {
        animes: animes.results,
        totalPages: 0,
        currentPage: page,
      };
    },
    getAnimeMostWatched: async (_, { page = 1, limit = 20 }) => {
      const animes = await Anime.query()

      return {
        animes: animes.results,
        totalPages: 0,
        currentPage: 0,
      };
    },
    getCurrentAiringThisSeason: async (_, { page = 0, limit = 1 }) => {
      const seasons = {
        1: "Winter",
        2: "Winter",
        3: "Winter",
        4: "Spring",
        5: "Spring",
        6: "Spring",
        7: "Summer",
        8: "Summer",
        9: "Summer",
        10: "Fall",
        11: "Fall",
        12: "Fall",
      };
      const today = moment();
      const dateMonth = seasons[today.month() + 1];

      const animes = await getCurrentSeasons(dateMonth, page, limit)

      return {
        animes: animes.results,
        totalPages: 0,
        currentPage: page,
      };
    },
    getCurrentAiringContinue: async (_, { page = 0, limit = 1 }) => {
      const seasons = {
        1: "Winter",
        2: "Winter",
        3: "Winter",
        4: "Spring",
        5: "Spring",
        6: "Spring",
        7: "Summer",
        8: "Summer",
        9: "Summer",
        10: "Fall",
        11: "Fall",
        12: "Fall",
      };
      const today = moment();
      const dateMonth = seasons[today.month() + 1];

      const animes = await getContinuedSeasons(dateMonth, page, limit);


      return {
        animes: animes.results,
        totalPages: 0,
        currentPage: page,
      };
    },
    getAnimePaths: async () => {
      const result = await getAnimePaths();
      return result;
    },
    getAnimesAiringToday: async () => {
      const result = await Anime.query();
      return result.results;
    },
  },

  Mutation: {
    deleteAnime: async (_, args) => {
      const response = {
        success: true,
        message: "Anime sucessfully Deleted!",
        anime_id: args.anime_id,
      };
      try {
        return null;
      } catch (error) {
        response.success = false;
        response.error = formatErrors(error);
        return response;
      }
    },
  },
};

module.exports = { animeResolver };
