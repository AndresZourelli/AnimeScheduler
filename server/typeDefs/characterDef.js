const { gql } = require("apollo-server-express");

const characterDef = gql`
  type Character {
    id: ID!
    name: String
    image_url: String
    role: String
    actor: String
    animes: [String]
  }

  type characterUpdateResponse {
    success: Boolean!
    message: String
    character_id: ID
  }

  type CharacterPath {
    id: ID
  }

  extend type Query {
    getCharacters: [Character]
    getCharacter(character_id: ID!): Character
    getCharacterPaths: [CharacterPath]
  }

  extend type Mutation {
    createCharacter(
      character_name: String!
      image_url: String
      role: String!
      animes: [String!]!
      actor: String!
    ): characterUpdateResponse!
    editCharacter(
      character_id: ID
      character_name: String
      image_url: String
      role: String
      animes: [String!]
      actor: String
    ): characterUpdateResponse!
    deleteCharacter(character_id: ID!): characterUpdateResponse!
  }
`;

module.exports = { characterDef };
