const { gql } = require("apollo-server-express");

const staffDef = gql`
  type Staff {
    id: ID!
    name: String
    image_url: String
    animes: String
  }

  type staffUpdateResponse {
    success: Boolean!
    message: String
    staff_id: ID
  }

  input StaffAnime {
    anime: String!
    role: String!
  }

  extend type Query {
    getStaffs: [Staff]
    getStaff(staff_id: ID!): Staff
  }

  extend type Mutation {
    createStaff(
      staff_name: String!
      image_url: String
      animes: [StaffAnime]!
      role: String!
    ): staffUpdateResponse!
    editStaff(
      staff_id: ID
      staff_name: String
      image_url: String
      role: String
      animes: [StaffAnime]!
    ): staffUpdateResponse!
    deleteStaff(staff_id: ID!): staffUpdateResponse!
  }
`;

module.exports = { staffDef };
