const { gql } = require("apollo-server-express");

const animeDef = gql`
  type Anime {
    _id: ID!
    title: String
    avg_score: Float
    description: String!
    image_url: String
    episodes: Int
    aired_start: String
    aired_end: String
    broadcast_day: String
    broadcast_time: String
    duration: String
    type: String
    season: String
    source: String
    status: String
    rating: String
    genres: [String]
    licensors: [String]
    producers: [String]
    studios: [String]
    alt_names: Names
    minutes_watched: Int
    actors: [AnimeActor]
    characters: [AnimeCharacter]
    staff: [AnimeStaff]
  }

  type AnimeStaff {
    id: ID!
    name: String
    image_url: String
    role: String
  }

  type AnimeCharacter {
    id: ID!
    name: String
    image_url: String
    role: String
  }

  type AnimeActor {
    id: ID!
    name: String
    image_url: String
    actor_language: String
    character: String
  }

  type Names {
    English: String
    Synonyms: String
    Japanese: String
  }

  input AnimeInput {
    title: String!
    score_avg: Float
    description: String!
    image_url: String
    episodes: Int
    aired_start: String
    aired_end: String
    broadcast_day: String
    broadcast_time: String
    duration: String
    type: String
    season: String
    source: String
    status: String
    rating: String
    genres: [String]
    licensors: [String]
    producers: [String]
    studios: [String]
    alt_names: InputNames
    minutes_watched: Int
  }

  input InputNames {
    English: String
    Synonyms: String
    Japanese: String
  }

  type AnimeResult {
    animes: [Anime]
    currentPage: Int
    totalPages: Int
  }

  type AnimePath {
    id: ID
  }

  type Query {
    getAnimes(search: String, page: Int, limit: Int): AnimeResult!
    getAnime(anime_id: ID!): Anime
    getAnimeHighestRated(page: Int, limit: Int): AnimeResult!
    getAnimeMostWatched(page: Int, limit: Int): AnimeResult!
    getCurrentAiringThisSeason(page: Int, limit: Int): AnimeResult!
    getCurrentAiringContinue(page: Int, limit: Int): AnimeResult!
    getAnimePaths: [AnimePath]
    getAnimesAiringToday: AnimeResult
  }

  type AnimeUpdateResponse {
    success: Boolean!
    message: String
    anime_id: ID
    error: [Error!]
  }

  type Error {
    type: String!
    message: String!
  }

  type Mutation {
    createAnime(data: AnimeInput!): AnimeUpdateResponse!
    editAnime(animeId: ID!, data: AnimeInput!): AnimeUpdateResponse!
    deleteAnime(animeId: ID!): AnimeUpdateResponse!
  }
`;

module.exports = { animeDef };
