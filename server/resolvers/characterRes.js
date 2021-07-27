const Character = require("../db/models/characters.model");

const characterResolver = {
  Query: {
    getCharacters: async (_, __) => {
      const result = await Character.query();
      return result;
    },
    getCharacter: async (_, args) => {
      const result = await Character.query().findById(args.character_id);
      return result;
    },
    getCharacterPaths: async () => {
      const result = await Character.query();
      return result;
    },
  },
  Mutation: {
    createCharacter: async (_, args) => {
      const data = args.input;
      const newCharacter = new Character(data);
      const response = {
        success: true,
        message: "Character sucessfully added!",
        character_id: newCharacter._id,
      };
      try {
        await newCharacter.save();
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    editCharacter: async (_, args) => {
      const { character_id } = args.input;
      const { data } = args.input;
      const response = {
        success: true,
        message: "Character sucessfully updated!",
        character_id,
      };
      try {
        await Character.updateOne({ _id: character_id }, data);
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
    deleteCharacter: async (_, args) => {
      const { character_id } = args;
      const response = {
        success: true,
        message: "Character sucessfully deleted!",
        character_id,
      };
      try {
        await Character.deleteOne({ _id: character_id });
        return response;
      } catch (error) {
        response.success = false;
        response.message = error;
        return response;
      }
    },
  },
};

module.exports = { characterResolver };
