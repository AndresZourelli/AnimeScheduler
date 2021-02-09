const { gql } = require("apollo-server");

const licensor_typeDefs = gql`
  type Licensor {
    licensor_id: ID!
    licensor_name: String!
  }

  input InputLicensor {
    licensor_id: ID!
    licensor_name: String
    checked: Boolean!
  }

  extend type Query {
    getLicensors: [Licensor]
  }
`;

module.exports = { licensor_typeDefs };
