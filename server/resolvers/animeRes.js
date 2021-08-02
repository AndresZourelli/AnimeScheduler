const moment = require("moment");
const Anime = require("../db/models/animes/animes.model.js");
const {
  getAnime,
  getHighestRatedAnimes,
  getCurrentSeasons,
  getContinuedSeasons,
  getAnimePaths,
  getAnimeStaff,
} = require("../db/models/animes/animes.queries");
const { formatErrors } = require("../utils/FormatError");
const db = require("../db/dbConfig");
const tableNames = require("../utils/constants/tableNames");

const animeResolver = {
  AnimeStaff: {
    person: async (parent) => {
      const result = await getAnimeStaff(parent.id);
      return result;
    },
    role: () => "stest",
  },
  Anime: {
    genres: async (parent) => {
      const result = await db(tableNames.anime_genre)
        .select(`${tableNames.genres}.id`, `${tableNames.genres}.genre`)
        .join(
          tableNames.genres,
          `${tableNames.anime_genre}.genre_id`,
          `${tableNames.genres}.id`
        )
        .where(`${tableNames.anime_genre}.anime_id`, "=", parent.id);
      return result;
    },
    licensors: async (parent) => {
      const result = await db(tableNames.anime_licensor)
        .select(
          `${tableNames.licensors}.id`,
          `${tableNames.licensors}.licensor`
        )
        .join(
          tableNames.licensors,
          `${tableNames.anime_licensor}.licensor_id`,
          `${tableNames.licensors}.id`
        )
        .where(`${tableNames.anime_licensor}.anime_id`, "=", parent.anime_id);
      return result;
    },
    producers: async (parent) => {
      const result = await db(tableNames.anime_producer)
        .select(
          `${tableNames.producers}.id`,
          `${tableNames.producers}.producer`
        )
        .join(
          tableNames.producers,
          `${tableNames.anime_producer}.producer_id`,
          `${tableNames.producers}.id`
        )
        .where(`${tableNames.anime_producer}.anime_id`, "=", parent.anime_id);
      return result;
    },
    studios: async (parent) => {
      const result = await db(tableNames.anime_studio)
        .select(`${tableNames.studios}.id`, `${tableNames.studios}.studio`)
        .join(
          tableNames.studios,
          `${tableNames.anime_studio}.studio_id`,
          `${tableNames.studios}.id`
        )
        .where(`${tableNames.anime_studio}.anime_id`, "=", parent.anime_id);
      return result;
    },
    characters: async (parent) => {
      const result = await db(tableNames.anime_character)
        .select("*")
        .join(
          tableNames.characters,
          `${tableNames.anime_character}.character_id`,
          `${tableNames.characters}.id`
        )
        .join(
          tableNames.character_images,
          `${tableNames.characters}.fk_character_primary_image`,
          `${tableNames.character_images}.character_image_id`
        )
        .join(
          tableNames.images,
          `${tableNames.character_images}.image_id`,
          `${tableNames.images}.id`
        )
        .join(
          tableNames.character_roles,
          `${tableNames.anime_character}.character_role_id`,
          `${tableNames.character_roles}.id`
        )
        .where(`${tableNames.anime_character}.anime_id`, "=", parent.anime_id);
      return result;
    },
    actors: async (parent) => {
      const result = await db(tableNames.anime_actor)
        .select("*")
        .join(
          tableNames.actors,
          `${tableNames.anime_actor}.fk_actor_id`,
          `${tableNames.actors}.actor_id`
        )
        .join(
          tableNames.images,
          `${tableNames.actors}.fk_actor_primary_image`,
          `${tableNames.images}.image_id`
        )
        .join(
          tableNames.languages,
          `${tableNames.anime_actor}.fk_language_id`,
          `${tableNames.languages}.language_id`
        )
        .where(`${tableNames.anime_actor}.fk_anime_id`, "=", parent.anime_id);
      return result;
    },
    staff: async (parent) => {
      animeResolver.AnimeStaff.person(parent);
    },
  },
  Query: {
    getAnimes: async (_, args) => {
      const { search = null, page = 1, limit = 1 } = args;
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
      const animes = await Anime.query().limit(limit);
      return {
        animes,
        totalPages: 0,
        currentPage: 0,
      };
    },
    getAnime: async (_, { animeId }) => {
      const result = await getAnime(animeId);
      return result[0];
    },
    getAnimeHighestRated: async (_, { page = 0, limit = 20 }) => {
      const animes = await getHighestRatedAnimes(limit, page);
      return {
        animes,
        totalPages: 0,
        currentPage: page,
      };
    },
    getAnimeMostWatched: async (_, { page = 1, limit = 20 }) => {
      const animes = await Anime.query();

      return {
        animes: animes.results,
        totalPages: 0,
        currentPage: 0,
      };
    },
    getCurrentAiringThisSeason: async (_, { page = 0, limit = 30 }) => {
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
      const season = `${dateMonth} ${today.format("YYYY")}`;

      const animes = await getCurrentSeasons(season, page, limit);

      return {
        animes,
        totalPages: 0,
        currentPage: page,
      };
    },
    getCurrentAiringContinue: async (_, { page = 0, limit = 30 }) => {
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
      const season = `${dateMonth} ${today.format("YYYY")}`;

      const animes = await getContinuedSeasons(season, page, limit);

      return {
        animes,
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
