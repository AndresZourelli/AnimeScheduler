const Licensor = require("../db/models/licensors.model");

const licensorResolver = {
  Query: {
    getLicensors: async (_, args) => {
      const result = await Licensor.query();
      return result;
    },
    getLicensor: async (_, args) => {
      const result = await Licensor.find({ _id: args.licensorId });
      return result;
    },
  },
  Mutation: {
    createLicensor: async (_, args) => {
      const data = args.input;
      const newLicensor = await Licensor.query().insert(data).returning("id");
      const response = {
        success: true,
        message: "Licensor sucessfully added!",
        licensorId: null,
      };
      try {
        response.licensorId = newLicensor.id;
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editLicensor: async (_, args) => {
      const { licensorId } = args.input;
      const { data } = args.input;
      const response = {
        success: true,
        message: "Licensor sucessfully updated!",
        licensorId,
      };
      try {
        await Licensor.query().findById(licensorId).patch(data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteLicensor: async (_, args) => {
      const { licensorId } = args;
      const response = {
        success: true,
        message: "Licensor sucessfully deleted!",
        licensorId,
      };
      try {
        await Licensor.query().deleteById(licensorId);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
  },
};

module.exports = { licensorResolver };
