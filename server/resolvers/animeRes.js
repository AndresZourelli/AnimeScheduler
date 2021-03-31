const moment = require("moment");
const Anime = require("../mongoDB/models/anime");
const { formatErrors } = require("../utils/FormatError");

const animeResolver = {
  Query: {
    getAnimes: async (_, args) => {
      const { search = null, page = 1, limit = 20 } = args;
      let searchQuery = {};

      if (search) {
        searchQuery = {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { alt_names: { $regex: search, $options: "i" } },
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
      const animes = await Anime.find(searchQuery)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();
      const count = await Anime.countDocuments(searchQuery);
      return {
        animes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    },
    getAnime: async (_, args) => {
      const result = await Anime.find({ _id: args.anime_id });
      return result[0];
    },
    getAnimeHighestRated: async (_, { page = 1, limit = 20 }) => {
      const animes = await Anime.find({
        $query: {},
        $orderby: { avg_score: -1 },
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const count = await Anime.countDocuments({});
      return {
        animes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    },
    getAnimeMostWatched: async (_, { page = 1, limit = 20 }) => {
      const animes = await Anime.find({
        $query: {},
        $orderby: { minutes_watched: -1 },
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const count = await Anime.countDocuments({});
      return {
        animes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    },
    getCurrentAiringThisSeason: async (_, { page = 1, limit = 30 }) => {
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

      const animes = await Anime.find({
        status: "Currently Airing",
        season: { $regex: `${dateMonth} ${today.year()}`, $options: "i" },
      })
        .sort({ avg_score: -1 })
        .lean();
      // .limit(limit)
      // .skip((page - 1) * limit)

      const count = await Anime.countDocuments({ status: "Currently Airing" });
      return {
        animes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    },
    getCurrentAiringContinue: async (_, { page = 1, limit = 30 }) => {
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

      const animes = await Anime.find({
        status: "Currently Airing",
        season: {
          $regex: `^((?!${dateMonth} ${today.year()}).)*$`,
        },
      })
        .sort({ avg_score: -1 })
        .lean();
      // .limit(limit)
      // .skip((page - 1) * limit)

      const count = await Anime.countDocuments({ status: "Currently Airing" });
      return {
        animes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    },
    getAnimePaths: async () => {
      const result = await Anime.find({}, { _id: 1 });
      return result;
    },
    getAnimesAiringToday: async () => {
      const result = await Anime.find({ status: "Currently Airing" });
    },
  },

  Mutation: {
    createAnime: async (_, args) => {
      const rawData = args.data;
      const newAnime = new Anime(rawData);
      const response = {
        success: true,
        message: "Anime sucessfully added!",
        anime_id: newAnime._id,
      };
      try {
        await newAnime.save();
        return response;
      } catch (e) {
        response.success = false;
        response.error = formatErrors(e);
        return response;
      }
    },
    editAnime: async (_, { anime_id: animeId, data }) => {
      const response = {
        success: true,
        message: "Anime sucessfully Updated!",
        anime_id: animeId,
      };
      try {
        await Anime.updateOne({ _id: animeId }, data);
        return response;
      } catch (e) {
        response.success = false;
        response.error = formatErrors(e);
        return response;
      }
    },
    deleteAnime: async (_, args) => {
      const response = {
        success: true,
        message: "Anime sucessfully Deleted!",
        anime_id: args.anime_id,
      };
      try {
        await Anime.deleteOne({ _id: args.anime_id });
        return response;
      } catch (error) {
        response.success = false;
        response.error = formatErrors(error);
        return response;
      }
    },
  },
};

module.exports = { animeResolver };
