const { gql } = require("apollo-server-express");

const animeDef = gql`
  type Anime {
    anime_id: ID
    anime_mal_id: Int
    anime_title: String
    avg_score: Float
    anime_description: String
    primary_image_url: String
    number_of_episodes: Int
    start_broadcast_datetime: String
    end_broadcast_datetime: String
    broadcast_day: String
    broadcast_time: String
    duration: String
    type: String
    season: String
    source: String
    status: String
    rating: String
    genres: [AnimeGenre]
    licensors: [AnimeLicensor]
    producers: [AnimeProducer]
    studios: [AnimeStudio]
    alt_names: Names
    minutes_watched: Int
    actors: [AnimeActor]
    characters: [AnimeCharacter]
    staff: [AnimeStaff]
  }

  type AnimeStaff {
    staff_id: ID!
    staff_name: String
    image_url: String
    role: String
  }

  type AnimeCharacter {
    character_id: ID!
    character_name: String
    image_url: String
    role: String
  }

  type AnimeActor {
    actor_id: ID!
    actor_name: String
    image_url: String
    actor_language: String
    character: String
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

  type AnimePath {
    anime_id: ID!
  }

  type AnimeLicensor {
    licensor_id: ID!
    licensor_name: String!
  }

  type AnimeGenre {
    genre_id: ID!
    genre_name: String!
  }

  type AnimeProducer {
    producer_id: ID!
    producer_name: String!
  }

  type AnimeStudio {
    studio_id: ID!
    studio_name: String!
  }

  type Query {
    getAnimes(search: String, page: Int, limit: Int): AnimeResult
    getAnime(anime_id: ID!): Anime
    getAnimeHighestRated(page: Int, limit: Int): AnimeResult
    getAnimeMostWatched(page: Int, limit: Int): AnimeResult
    getCurrentAiringThisSeason(page: Int, limit: Int): AnimeResult
    getCurrentAiringContinue(page: Int, limit: Int): AnimeResult
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
    deleteAnime(animeId: ID!): AnimeUpdateResponse!
  }
`;

module.exports = { animeDef };
