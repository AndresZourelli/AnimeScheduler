const Genre = require("../db/models/genres.model");

const genreResolver = {
  Query: {
    getGenres: async (_, args) => {
      const result = await Genre.query();
      return result;
    },
    getGenre: async (_, { genreId }) => {
      const result = await Genre.query().findById(genreId);
      return result;
    },
  },
  Mutation: {
    createGenre: async (_, args) => {
      const data = args.input;
      const response = {
        success: true,
        message: "Genre sucessfully added!",
        genreId: null,
      };
      try {
        const newGenre = await Genre.query().insert(data).returning("id");
        response.genreId = newGenre.id;
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editGenre: async (_, args) => {
      const { genreId } = args.input;
      const { data } = args.input;
      const response = {
        success: true,
        message: "Genre sucessfully updated!",
        genreId,
      };
      try {
        await Genre.query().findById(genreId).patch(data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteGenre: async (_, args) => {
      const { genreId } = args;
      const response = {
        success: true,
        message: "Genre sucessfully deleted!",
        genreId,
      };
      try {
        await Genre.query().deleteById(genreId);
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
