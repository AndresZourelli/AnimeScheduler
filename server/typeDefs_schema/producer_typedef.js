const { gql } = require("apollo-server");

const producer_typeDefs = gql`
  type Producer {
    producer_id: ID!
    producer_name: String!
  }

  input InputProducer {
    producer_id: ID!
    producer_name: String
    checked: Boolean!
  }

  extend type Query {
    getProducers: [Producer]
  }
`;

module.exports = { producer_typeDefs };
