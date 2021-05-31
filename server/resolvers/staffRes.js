const Staff = require("../mongoDB/models/staff");

const staffResolver = {
  Query: {
    getStaffs: async (_, __) => {
      const result = await Staff.find({});
      return result;
    },
    getStaff: async (_, args) => {
      const result = await Staff.find({ _id: args.staff_id });
      return result[0];
    },
    getStaffPaths: async (_, args) => {
      const result = await Staff.find({}, { _id: 1 });
      return result;
    },
  },
  Mutation: {
    createStaff: async (_, args) => {
      const data = args.input;
      const newStaff = new Staff(data);
      const response = {
        success: true,
        message: "Staff sucessfully added!",
        staff_id: newStaff._id,
      };
      try {
        await newStaff.save();
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editStaff: async (_, args) => {
      const { staff_id } = args.input;
      const { data } = args.input;
      let response = {
        success: true,
        message: "Staff sucessfully updated!",
        staff_id: staff_id,
      };
      try {
        await Staff.updateOne({ _id: staff_id }, data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteStaff: async (_, args) => {
      const { staff_id } = args;
      let response = {
        success: true,
        message: "Staff sucessfully deleted!",
        staff_id: staff_id,
      };
      try {
        await Staff.deleteOne({ _id: staff_id });
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
  },
};

module.exports = { staffResolver };
