const { gql } = require("apollo-server-express");

const producer_typeDefs = gql`
  type Producer {
    producer_id: ID!
    producer_name: String!
  }

  input producerInput {
    producer_id: ID
    producer_name: String
    checked: Boolean
  }

  input producerInputRequest {
    producer_id: ID!
    data: producerInput
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
    createProducer(input: producerInput): producerUpdateResponse!
    editProducer(input: producerInputRequest): producerUpdateResponse!
    deleteProducer(producer_id: ID!): producerUpdateResponse!
  }
`;

module.exports = { producer_typeDefs };
