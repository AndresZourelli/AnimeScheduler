const Genres = require("../mongoDB/models/genre");

const genreResolver = {
  Query: {
    getGenres: async (_, args) => {
      const result = await Genres.find({});
      return result;
    },
    getGenre: async (_, args) => {
      const result = await Genres.find({ _id: args.genre_id });
      return result[0];
    },
  },
};

module.exports = { genreResolver };
