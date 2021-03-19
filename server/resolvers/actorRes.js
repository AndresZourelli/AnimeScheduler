const Actor = require("../mongoDB/models/actor");

const actorResolver = {
  Query: {
    getActors: async (_, __) => {
      const result = await Actor.find({});
      return result;
    },
    getActor: async (_, args) => {
      const result = await Actor.find({ _id: args.actor_id });
      return result[0];
    },
  },
  Mutation: {
    createActor: async (_, args) => {
      const data = args.input;
      const newActor = new Actor(data);
      const response = {
        success: true,
        message: "Actor sucessfully added!",
        actor_id: newActor._id,
      };
      try {
        await newActor.save();
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editActor: async (_, args) => {
      const { actor_id } = args.input;
      const { data } = args.input;
      let response = {
        success: true,
        message: "Actor sucessfully updated!",
        actor_id: actor_id,
      };
      try {
        await Actor.updateOne({ _id: actor_id }, data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteActor: async (_, args) => {
      const { actor_id } = args;
      let response = {
        success: true,
        message: "Actor sucessfully deleted!",
        actor_id: actor_id,
      };
      try {
        await Actor.deleteOne({ _id: actor_id });
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
  },
};

module.exports = { actorResolver };
