const Producer = require("../mongoDB/models/producer");

const producerResolver = {
  Query: {
    getProducers: async (_, args) => {
      const result = await Producer.find({});
      return result;
    },
  },
};

module.exports = { producerResolver };
