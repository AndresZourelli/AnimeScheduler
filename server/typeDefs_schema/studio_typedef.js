const { gql } = require("apollo-server");

const studio_typeDefs = gql`
  type Studio {
    studio_id: ID!
    studio_name: String!
  }

  input studioInput {
    studio_id: ID
    studio_name: String
    checked: Boolean
  }

  input studioInputRequest {
    studio_id: ID!
    data: studioInput
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
    createStudio(input: studioInput): studioUpdateResponse!
    editStudio(input: studioInputRequest): studioUpdateResponse!
    deleteStudio(studio_id: ID!): studioUpdateResponse!
  }
`;

module.exports = { studio_typeDefs };
