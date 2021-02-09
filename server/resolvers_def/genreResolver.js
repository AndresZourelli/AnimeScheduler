const Genres = require("../mongoDB/models/genre");

const genreResolver = {
  Query: {
    getGenres: async (_, args) => {
      const result = await Genres.find({});
      return result;
    },
  },
};

module.exports = { genreResolver };
