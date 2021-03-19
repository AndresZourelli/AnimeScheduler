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
    anime: String!
    character: String!
  }

  type ActorAnime {
    anime: String!
    character: String!
  }

  extend type Query {
    getActors: [Actor]
    getActor(actor_id: ID!): Actor
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
