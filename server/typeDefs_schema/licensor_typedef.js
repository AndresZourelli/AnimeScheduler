const { gql } = require("apollo-server-express");

const licensor_typeDefs = gql`
  type Licensor {
    licensor_id: ID!
    licensor_name: String!
  }

  input licensorInput {
    licensor_id: ID
    licensor_name: String
    checked: Boolean
  }

  input licensorInputRequest {
    licensor_id: ID!
    data: licensorInput
  }

  type licensorUpdateResponse {
    success: Boolean!
    message: String
    licensor_id: ID
  }

  extend type Query {
    getLicensors: [Licensor]
    getLicensor(licensor_id: ID!): Licensor
  }

  extend type Mutation {
    createLicensor(input: licensorInput): licensorUpdateResponse!
    editLicensor(input: licensorInputRequest): licensorUpdateResponse!
    deleteLicensor(licensor_id: ID!): licensorUpdateResponse!
  }
`;

module.exports = { licensor_typeDefs };
