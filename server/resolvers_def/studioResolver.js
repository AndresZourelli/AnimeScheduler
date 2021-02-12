const Studio = require("../mongoDB/models/studio");

const studioResolver = {
  Query: {
    getStudio: async (_, args) => {
      const result = await Studio.find({ _id: args.studio_id });
      return result[0];
    },
    getStudios: async (_, args) => {
      const result = await Studio.find({});
      return result;
    },
  },
  Mutation: {
    createStudio: async (_, args) => {
      const data = args.input;
      const new_studio = new Studio(data);
      let response = {
        success: true,
        message: "Studio sucessfully added!",
        studio_id: new_studio._id,
      };
      try {
        await new_studio.save();
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editStudio: async (_, args) => {
      const { studio_id } = args.input;
      const { data } = args.input;
      let response = {
        success: true,
        message: "Studio sucessfully updated!",
        studio_id: studio_id,
      };
      try {
        await Studio.updateOne({ _id: studio_id }, data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteStudio: async (_, args) => {
      const { studio_id } = args;
      let response = {
        success: true,
        message: "Studio sucessfully deleted!",
        studio_id: studio_id,
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
