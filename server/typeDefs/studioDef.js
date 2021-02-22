const { gql } = require("apollo-server-express");

const studioDef = gql`
  type Studio {
    studio_id: ID!
    studio_name: String!
  }

  type studioUpdateResponse {
    success: Boolean!
    message: String
    studio_id: ID
  }

  extend type Query {
    getStudios: [Studio]
    getStudio(studio_id: ID!): Studio
  }

  extend type Mutation {
    createStudio(studio_name: String): studioUpdateResponse!
    editStudio(studio_id: ID!, studio_name: String!): studioUpdateResponse!
    deleteStudio(studio_id: ID!): studioUpdateResponse!
  }
`;

module.exports = { studioDef };
