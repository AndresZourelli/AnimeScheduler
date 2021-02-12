const Licensor = require("../mongoDB/models/licensor");

const licensorResolver = {
  Query: {
    getLicensors: async (_, args) => {
      const result = await Licensor.find({});
      return result;
    },
    getLicensor: async (_, args) => {
      const result = await Licensor.find({ _id: args.licensor_id });
      return result[0];
    },
  },
  Mutation: {
    createLicensor: async (_, args) => {
      const data = args.input;
      const new_licensor = new Licensor(data);
      let response = {
        success: true,
        message: "Licensor sucessfully added!",
        licensor_id: new_licensor._id,
      };
      try {
        await new_licensor.save();
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editLicensor: async (_, args) => {
      const { licensor_id } = args.input;
      const { data } = args.input;
      let response = {
        success: true,
        message: "Licensor sucessfully updated!",
        licensor_id: licensor_id,
      };
      try {
        await Licensor.updateOne({ _id: licensor_id }, data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteLicensor: async (_, args) => {
      const { licensor_id } = args;
      let response = {
        success: true,
        message: "Licensor sucessfully deleted!",
        licensor_id: licensor_id,
      };
      try {
        await Licensor.deleteOne({ _id: licensor_id });
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
