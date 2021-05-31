const { gql } = require("apollo-server-express");

const characterDef = gql`
  type Character {
    id: ID!
    name: String
    image_url: String
    role: String
    actors: [CharacterActor]
    animes: [CharacterAnimes]
  }

  type CharacterAnimes {
    anime: String
    id: ID
  }

  input CharacterAnimesInput {
    anime: String
    id: ID
  }

  type CharacterActor {
    id: ID
    name: String
    image_url: String
    actor_language: String
  }

  input CharacterActorInput {
    id: ID
    name: String
    image_url: String
    actor_language: String
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
      animes: [CharacterAnimesInput]!
      actors: [CharacterActorInput]!
    ): characterUpdateResponse!
    editCharacter(
      character_id: ID
      character_name: String
      image_url: String
      role: String
      animes: [CharacterAnimesInput]
      actors: [CharacterActorInput]!
    ): characterUpdateResponse!
    deleteCharacter(character_id: ID!): characterUpdateResponse!
  }
`;

module.exports = { characterDef };
