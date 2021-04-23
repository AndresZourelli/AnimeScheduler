const { gql } = require("apollo-server-express");

const userDef = gql`
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
    getUser(id: ID!): UserResponse!
  }

  extend type Mutation {
    createUser(
      username: String!
      password: String!
      verifyPassword: String!
      email: String!
    ): UserResponse!
  }
`;

module.exports = { userDef };
