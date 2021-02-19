const { gql } = require("apollo-server-express");

const user_typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    email: String
    message: String
  }

  type UserResponse {
    success: Boolean!
    errors: [UserError!]
    token: String
    user: User
  }

  type UserError {
    type: String!
    message: String!
  }

  extend type Query {
    userLogin(password: String!, email: String!): UserResponse!
    getUser(id: ID!): UserResponse!
  }

  extend type Mutation {
    createUser(
      username: String!
      password: String!
      email: String!
    ): UserResponse!
  }
`;

module.exports = { user_typeDefs };
