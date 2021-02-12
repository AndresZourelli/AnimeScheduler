const Genre = require("../mongoDB/models/genre");

const genreResolver = {
  Query: {
    getGenres: async (_, args) => {
      const result = await Genre.find({});
      return result;
    },
    getGenre: async (_, args) => {
      const result = await Genre.find({ _id: args.genre_id });
      return result[0];
    },
  },
  Mutation: {
    createGenre: async (_, args) => {
      const data = args.input;
      const new_genre = new Genre(data);
      let response = {
        success: true,
        message: "Genre sucessfully added!",
        genre_id: new_genre._id,
      };
      try {
        await new_genre.save();
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editGenre: async (_, args) => {
      const { genre_id } = args.input;
      const { data } = args.input;
      let response = {
        success: true,
        message: "Genre sucessfully updated!",
        genre_id: genre_id,
      };
      try {
        await Genre.updateOne({ _id: genre_id }, data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteGenre: async (_, args) => {
      const { genre_id } = args;
      let response = {
        success: true,
        message: "Genre sucessfully deleted!",
        genre_id: genre_id,
      };
      try {
        await Genre.deleteOne({ _id: genre_id });
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
  },
};

module.exports = { genreResolver };
