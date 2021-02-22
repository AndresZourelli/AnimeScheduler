const Producer = require("../mongoDB/models/producer");

const producerResolver = {
  Query: {
    getProducers: async (_, args) => {
      const result = await Producer.find({});
      return result;
    },
    getProducer: async (_, args) => {
      const result = await Producer.find({ _id: args.producer_id });
      return result[0];
    },
  },
  Mutation: {
    createProducer: async (_, args) => {
      const data = args.input;
      const new_producer = new Producer(data);
      let response = {
        success: true,
        message: "Producer sucessfully added!",
        producer_id: new_producer._id,
      };
      try {
        await new_producer.save();
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editProducer: async (_, args) => {
      const { producer_id } = args.input;
      const { data } = args.input;
      let response = {
        success: true,
        message: "Producer sucessfully updated!",
        producer_id: producer_id,
      };
      try {
        await Producer.updateOne({ _id: producer_id }, data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteProducer: async (_, args) => {
      const { producer_id } = args;
      let response = {
        success: true,
        message: "Producer sucessfully deleted!",
        producer_id: producer_id,
      };
      try {
        await Producer.deleteOne({ _id: producer_id });
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
