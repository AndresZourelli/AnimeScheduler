const Studio = require("../db/models/studios.model");

const studioResolver = {
  Query: {
    getStudio: async (_, { studioId }) => {
      const result = await Studio.query().findById(studioId);
      return result;
    },
    getStudios: async () => {
      const result = await Studio.find({});
      return result;
    },
  },
  Mutation: {
    createStudio: async (_, { studioName }) => {
      const response = {
        success: true,
        message: "Studio sucessfully added!",
        studioId: null,
      };
      try {
        const newStudio = await Studio.query().insert({ studio: studioName });
        response.studioId = newStudio.id;
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editStudio: async (_, { studioId, studioName }) => {
      const response = {
        success: true,
        message: "Studio sucessfully updated!",
        studioId,
      };
      try {
        await Studio.query().findById(studioId).patch({ studio: studioName });
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteStudio: async (_, { studioId }) => {
      const response = {
        success: true,
        message: "Studio sucessfully deleted!",
        studioId,
      };
      try {
        await Studio.query().deleteById(studioId);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
  },
};

module.exports = { studioResolver };
