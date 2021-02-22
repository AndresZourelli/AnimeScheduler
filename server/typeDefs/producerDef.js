const { gql } = require("apollo-server-express");

const producerDef = gql`
  type Producer {
    producer_id: ID!
    producer_name: String!
  }

  type producerUpdateResponse {
    success: Boolean!
    message: String
    producer_id: ID
  }

  extend type Query {
    getProducers: [Producer]
    getProducer(producer_id: ID!): Producer
  }

  extend type Mutation {
    createProducer(producer_name: String): producerUpdateResponse!
    editProducer(
      producer_id: ID
      producer_name: String
    ): producerUpdateResponse!
    deleteProducer(producer_id: ID!): producerUpdateResponse!
  }
`;

module.exports = { producerDef };
