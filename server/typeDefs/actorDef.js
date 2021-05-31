const { gql } = require("apollo-server-express");

const actorDef = gql`
  type Actor {
    id: ID!
    name: String
    image_url: String
    actor_language: String
    animes: [ActorAnime]
  }

  type actorUpdateResponse {
    success: Boolean!
    message: String
    actor_id: ID
  }

  input ActorAnimeInput {
    anime: ActorAnimeObjInput
    character: ActorCharacterObjInput
  }

  input ActorAnimeObjInput {
    title: String
    image_url: String
    id: ID
  }
  input ActorCharacterObjInput {
    name: String
    image_url: String
    character_id: ID
  }

  type ActorAnimeObj {
    title: String
    image_url: String
    id: ID
  }
  type ActorCharacterObj {
    name: String
    image_url: String
    character_id: ID
  }
  type ActorAnime {
    anime: ActorAnimeObj
    character: ActorCharacterObj
  }

  type ActorPath {
    id: ID
  }

  extend type Query {
    getActors: [Actor]
    getActor(actor_id: ID!): Actor
    getActorPaths: [ActorPath]
  }

  extend type Mutation {
    createActor(
      actor_name: String!
      image_url: String
      actor: ActorAnimeInput!
      actor_language: String!
      animes: [ActorAnimeInput]!
    ): actorUpdateResponse!
    editActor(
      actor_id: ID
      actor_name: String
      image_url: String
      actor: ActorAnimeInput
      actor_language: String
      animes: [ActorAnimeInput]!
    ): actorUpdateResponse!
    deleteActor(actor_id: ID!): actorUpdateResponse!
  }
`;

module.exports = { actorDef };
