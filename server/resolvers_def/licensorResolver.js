const Licensors = require("../mongoDB/models/licensor");

const licensorResolver = {
  Query: {
    getLicensors: async (_, args) => {
      const result = await Licensors.find({});
      return result;
    },
  },
};

module.exports = { licensorResolver };
