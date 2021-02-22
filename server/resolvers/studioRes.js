const Studio = require("../mongoDB/models/studio");

const studioResolver = {
  Query: {
    getStudio: async (_, args) => {
      const result = await Studio.find({ _id: args.studio_id });
      return result[0];
    },
    getStudios: async () => {
      const result = await Studio.find({});
      return result;
    },
  },
  Mutation: {
    createStudio: async (_, { studio_name }) => {
      const newStudio = new Studio({ studio_name });
      const response = {
        success: true,
        message: "Studio sucessfully added!",
        studio_id: newStudio._id,
      };
      try {
        await newStudio.save();
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editStudio: async (_, { studio_id, studio_name }) => {
      const response = {
        success: true,
        message: "Studio sucessfully updated!",
        studio_id,
      };
      try {
        await Studio.updateOne({ _id: studio_id }, { studio_name });
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteStudio: async (_, { studio_id }) => {
      const response = {
        success: true,
        message: "Studio sucessfully deleted!",
        studio_id,
      };
      try {
        await Studio.deleteOne({ _id: studio_id });
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
