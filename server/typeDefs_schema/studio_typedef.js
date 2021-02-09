const { gql } = require("apollo-server");

const studio_typeDefs = gql`
  type Studio {
    studio_id: ID!
    studio_name: String!
  }

  input InputStudio {
    studio_id: ID!
    studio_name: String
    checked: Boolean!
  }
  extend type Query {
    getStudios: [Studio]
  }
`;

module.exports = { studio_typeDefs };
