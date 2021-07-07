const Anime = require("../mongoDB/models/anime");
const Character = require("../mongoDB/models/character");
const Staff = require("../mongoDB/models/staff");
const Studio = require("../mongoDB/models/studio");

const searchResolver = {
  SearchResultType: {
    __resolveType(obj) {
      if (obj.name) {
        return "SearchCharacterStaffResultType";
      }
      if (obj.title) {
        return "SearchAnimeResultType";
      }
      if (obj.studio_name) {
        return "SearchStudioResultType";
      }
      return null;
    },
  },
  Query: {
    getSearchRelatedMaterials: async (_, { search, limit = 20, page = 1 }) => {
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { "alt_names.English": { $regex: search, $options: "i" } },
            { "alt_names.Synonyms": { $regex: search, $options: "i" } },
            { "alt_names.Japanese": { $regex: search, $options: "i" } },
          ],
        };
      }

      const animes = await Anime.find(searchQuery, {
        title: 1,
        _id: 1,
        image_url: 1,
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const count = await Anime.countDocuments(searchQuery);
      return {
        result: animes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    },
    getSearchCharacter: async (_, { search, limit = 20, page = 1 }) => {
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [{ name: { $regex: search, $options: "i" } }],
        };
      }

      const characters = await Character.find(searchQuery, {
        name: 1,
        _id: 1,
        image_url: 1,
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const count = await Character.countDocuments(searchQuery);
      return {
        result: characters,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    },
    getSearchStaff: async (_, { search, limit = 20, page = 1 }) => {
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [{ name: { $regex: search, $options: "i" } }],
        };
      }

      const staff = await Staff.find(searchQuery, {
        name: 1,
        _id: 1,
        image_url: 1,
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const count = await Staff.countDocuments(searchQuery);
      return {
        result: staff,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    },
    getSearchStudio: async (_, { search, limit = 20, page = 1 }) => {
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [{ studio_name: { $regex: search, $options: "i" } }],
        };
      }

      const studio = await Studio.find(searchQuery, {
        studio_name: 1,
        _id: 1,
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const count = await Studio.countDocuments(searchQuery);
      return {
        result: studio,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    },
  },
};

module.exports = { searchResolver };
