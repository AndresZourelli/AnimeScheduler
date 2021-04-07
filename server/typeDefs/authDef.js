const { gql } = require("apollo-server-express");

const authDef = gql`
  type AuthData {
    userId: ID
    success: Boolean!
    errors: [AuthError]
  }

  type AuthError {
    type: String!
    message: String!
  }

  type ResetTokenResponse {
    success: Boolean!
    message: String!
  }

  extend type Query {
    login(email: String!, password: String!): AuthData!
    verifyResetToken(token: String!): Boolean!
  }

  extend type Mutation {
    invalidateTokens: Boolean!
    generateResetToken(user_id: ID!): Boolean!
    changePassword(
      password: String!
      verifyPassword: String!
      token: String!
    ): ResetTokenResponse!
  }
`;

module.exports = { authDef };
