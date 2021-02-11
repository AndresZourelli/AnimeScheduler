const Studio = require("../mongoDB/models/studio");

const studioResolver = {
  Query: {
    getStudios: async (_, args) => {
      const result = await Studio.find({});
      return result;
    },
  },
};

module.exports = { studioResolver };
