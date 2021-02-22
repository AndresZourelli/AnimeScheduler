const { gql } = require("apollo-server-express");

const authDef = gql`
  type AuthData {
    userId: ID
    success: Boolean!
    errors: [AuthError!]
  }

  type AuthError {
    type: String!
    message: String!
  }

  extend type Query {
    login(email: String!, password: String!): AuthData!
    refreshToken(token: String!): Boolean!
  }
`;

module.exports = { authDef };
