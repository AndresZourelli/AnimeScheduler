const { gql } = require("apollo-server-express");

const searchDef = gql`
  type SearchResult {
    result: [SearchResultType]
    totalPages: Int
    currentPage: Int
  }

  type SearchCharacterStaffResultType {
    name: String!
    _id: ID!
    image_url: String!
  }

  type SearchStudioResultType {
    studio_name: String!
    _id: ID!
  }

  type SearchAnimeResultType {
    title: String!
    _id: ID!
    image_url: String!
  }

  union SearchResultType =
      SearchAnimeResultType
    | SearchCharacterStaffResultType
    | SearchStudioResultType

  extend type Query {
    getSearchRelatedMaterials(
      search: String!
      page: Int
      limit: Int
    ): SearchResult

    getSearchCharacter(search: String!, page: Int, limit: Int): SearchResult
    getSearchStaff(search: String!, page: Int, limit: Int): SearchResult
    getSearchStudio(search: String!, page: Int, limit: Int): SearchResult
  }
`;

module.exports = { searchDef };
