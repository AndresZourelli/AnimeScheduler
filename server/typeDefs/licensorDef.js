const { gql } = require("apollo-server-express");

const licensorDef = gql`
  type Licensor {
    licensor_id: ID!
    licensor_name: String!
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
    createLicensor(licensor_name: String): licensorUpdateResponse!
    editLicensor(
      licensor_id: ID
      licensor_name: String
    ): licensorUpdateResponse!
    deleteLicensor(licensor_id: ID!): licensorUpdateResponse!
  }
`;

module.exports = { licensorDef };
