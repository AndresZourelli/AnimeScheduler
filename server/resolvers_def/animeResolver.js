const Anime = require("../mongoDB/models/anime");

const animeResolver = {
  Query: {
    getAnimes: async (_, args) => {
      const result = await Anime.find({});
      return result;
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
