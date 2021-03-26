const { gql } = require("apollo-server-express");

const staffDef = gql`
  type Staff {
    id: ID!
    name: String
    image_url: String
    animes: [StaffAnime]
  }

  type staffUpdateResponse {
    success: Boolean!
    message: String
    staff_id: ID
  }

  input StaffAnimeInput {
    title: String!
    role: String!
    image_url: String!
    id: ID!
  }
  type StaffAnime {
    title: String!
    role: String!
    image_url: String!
    id: ID!
  }

  type StaffPath {
    id: ID
  }

  extend type Query {
    getStaffs: [Staff]
    getStaff(staff_id: ID!): Staff
    getStaffPaths: [StaffPath]
  }

  extend type Mutation {
    createStaff(
      staff_name: String!
      image_url: String
      animes: [StaffAnimeInput]!
      role: String!
    ): staffUpdateResponse!
    editStaff(
      staff_id: ID
      staff_name: String
      image_url: String
      role: String
      animes: [StaffAnimeInput]!
    ): staffUpdateResponse!
    deleteStaff(staff_id: ID!): staffUpdateResponse!
  }
`;

module.exports = { staffDef };
