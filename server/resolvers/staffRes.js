const Staff = require("../db/models/staff.model");

const staffResolver = {
  Query: {
    getStaffs: async (_, __) => {
      const result = await Staff.find({});
      return result;
    },
    getStaff: async (_, { staffId }) => {
      const result = await Staff.query().findById(staffId);
      return result;
    },
    getStaffPaths: async (_, args) => {
      const result = await Staff.query().select("id");
      return result;
    },
  },
  Mutation: {
    createStaff: async (_, args) => {
      const data = args.input;
      const response = {
        success: true,
        message: "Staff sucessfully added!",
        staffId: null,
      };
      try {
        const newStaff = await Staff.query().insert(data).returning("id");
        response.staffId = newStaff.id;
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editStaff: async (_, args) => {
      const { staffId } = args.input;
      const { data } = args.input;
      const response = {
        success: true,
        message: "Staff sucessfully updated!",
        staffId,
      };
      try {
        await Staff.query().findById(staffId).patch(data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteStaff: async (_, args) => {
      const { staffId } = args;
      const response = {
        success: true,
        message: "Staff sucessfully deleted!",
        staffId,
      };
      try {
        await Staff.query().deleteById(staffId);
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
