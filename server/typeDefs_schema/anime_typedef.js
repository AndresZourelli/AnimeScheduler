const { gql } = require("apollo-server-express");

const anime_typeDefs = gql`
  type Anime {
    _id: ID!
    title: String
    score_avg: Float
    description: String!
    image_url: String
    episodes: Int
    aired_start: String
    aired_end: String
    broadcast_day: String
    broadcast_time: String
    duration: Int
    type: String
    season: String
    source: String
    status: String
    rating_name: String
    rating_id: Int
    genres: [String]
    licensors: [String]
    producers: [String]
    studios: [String]
    alt_names: Names
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
    duration: Int
    type: String
    season: String
    source: String
    status: String
    rating_name: String
    rating_id: Int
    genres: [String]
    licensors: [String]
    producers: [String]
    studios: [String]
    alt_names: InputNames
  }

  type Names {
    English: String
    Synonyms: String
    Japanese: String
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

  type Query {
    getAnimes(search: String, page: Int, limit: Int): AnimeResult
    getAnime(anime_id: ID!): Anime
  }

  type AnimeUpdateResponse {
    success: Boolean!
    message: String
    anime_id: ID
  }

  input AnimeInputRequest {
    anime_id: ID!
    data: AnimeInput
  }

  type Mutation {
    createAnime(input: AnimeInput): AnimeUpdateResponse!
    editAnime(input: AnimeInputRequest): AnimeUpdateResponse!
    deleteAnime(anime_id: ID!): AnimeUpdateResponse!
  }
`;

module.exports = { anime_typeDefs };
