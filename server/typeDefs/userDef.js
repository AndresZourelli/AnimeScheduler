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

  type AddAnimeToUserResponse {
    success: Boolean!
    errors: [UserError!]
  }

  type GetUserAnimeResponse {
    success: Boolean!
    errors: [UserError!]
    animes: [Anime!]
  }

  extend type Query {
    getUser(id: ID!): UserResponse!
    getUserAnimes: GetUserAnimeResponse!
  }

  extend type Mutation {
    createUser(
      username: String!
      password: String!
      verifyPassword: String!
      email: String!
    ): UserResponse!

    addAnimeToUser(animeId: ID!): AddAnimeToUserResponse!
  }
`;

module.exports = { userDef };
