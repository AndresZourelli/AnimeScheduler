const { gql } = require("apollo-server-express");

const user_typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    email: String
    message: String
  }

  input CreateUserInput {
    username: String!
    password: String!
    email: String!
  }

  type CreateUserResponse {
    success: Boolean!
    message: String
    user_id: ID
    token: String!
  }

  type UserLoginResponse {
    user: User
    success: Boolean!
    errorMessage: String
    token: String
  }

  input UserLogin {
    password: String!
    email: String!
  }

  extend type Query {
    userLogin(input: UserLogin): UserLoginResponse!
    getUser(id: ID!): User!
  }

  extend type Mutation {
    createUser(input: CreateUserInput): CreateUserResponse!
  }
`;

module.exports = { user_typeDefs };
