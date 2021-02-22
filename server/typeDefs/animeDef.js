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
    minutes_watched: Int
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
    minutes_watched: Int
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
    getAnimes(search: String, page: Int, limit: Int): AnimeResult!
    getAnime(anime_id: ID!): Anime
    getAnimeHighestRated(page: Int, limit: Int): AnimeResult!
    getAnimeMostWatched(page: Int, limit: Int): AnimeResult!
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
