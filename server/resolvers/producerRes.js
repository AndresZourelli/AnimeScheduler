const Producer = require("../db/models/producers.model");

const producerResolver = {
  Query: {
    getProducers: async (_, args) => {
      const result = await Producer.query();
      return result;
    },
    getProducer: async (_, { producerId }) => {
      const result = await Producer.query().findById(producerId);
      return result;
    },
  },
  Mutation: {
    createProducer: async (_, args) => {
      const data = args.input;
      const response = {
        success: true,
        message: "Producer sucessfully added!",
        producerId: null,
      };
      try {
        const newProducer = await Producer.query().insert(data);
        response.producerId = newProducer.id;
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editProducer: async (_, args) => {
      const { producerId } = args.input;
      const { data } = args.input;
      const response = {
        success: true,
        message: "Producer sucessfully updated!",
        producerId,
      };
      try {
        await Producer.query().findById(producerId).patch(data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteProducer: async (_, args) => {
      const { producerId } = args;
      const response = {
        success: true,
        message: "Producer sucessfully deleted!",
        producerId,
      };
      try {
        await Producer.query().deleteById(producerId);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
  },
};

module.exports = { producerResolver };
