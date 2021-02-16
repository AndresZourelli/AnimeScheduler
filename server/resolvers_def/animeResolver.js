const Anime = require("../mongoDB/models/anime");

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
            { score_avg: { $regex: search, $options: "i" } },
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
  },

  Mutation: {
    createAnime: async (_, args) => {
      const raw_data = args.input;
      const new_anime = new Anime(raw_data);
      let response = {
        success: true,
        message: "Anime sucessfully added!",
        anime_id: new_anime._id,
      };
      try {
        await new_anime.save();
        return response;
      } catch (e) {
        response.success = false;
        response.message = e;
        return response;
      }
    },
    editAnime: async (_, args) => {
      const raw_data = args.input;
      let response = {
        success: true,
        message: "Anime sucessfully Updated!",
        anime_id: args.input.anime_id,
      };
      try {
        const update = await Anime.updateOne(
          { _id: raw_data.anime_id },
          raw_data.data
        );
        return response;
      } catch (e) {
        response.success = false;
        response.message = e;
        return response;
      }
    },
    deleteAnime: async (_, args) => {
      let response = {
        success: true,
        message: "Anime sucessfully Deleted!",
        anime_id: args.anime_id,
      };
      try {
        await Anime.deleteOne({ _id: args.anime_id });
        return response;
      } catch (error) {
        response.success = false;
        response.message = e;
        return response;
      }
    },
  },
};

module.exports = { animeResolver };
