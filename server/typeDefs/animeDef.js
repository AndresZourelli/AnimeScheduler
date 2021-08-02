const { gql } = require("apollo-server-express");

const animeDef = gql`
  type Anime {
    id: ID
    mal_id: Int
    title: String
    average_watcher_rating: Float
    description: String
    url: String
    number_of_episodes: Int
    start_broadcast_datetime: String
    end_broadcast_datetime: String
    broadcast_day: String
    broadcast_time: String
    duration: String
    media_type: String
    season: String
    source_material_type: String
    airing_status_type: String
    age_rating: String
    genres: [AnimeGenre]
    licensors: [AnimeLicensor]
    producers: [AnimeProducer]
    studios: [AnimeStudio]
    alt_names: Names
    minutes_watched: Int
    actors: [AnimeActor]
    characters: [AnimeCharacter]
    staff: [AnimeStaff!]
  }

  type AnimeStaff {
    person: Person
    role: String
  }

  type Person {
    id: ID
    first_name: String
    last_name: String
    native_name: String
    alternate_names: String
    description: String
    profile_image_url: String
  }

  type AnimeCharacter {
    character_id: ID!
    character_name: String
    image_url: String
    character_role_name: String
  }

  type AnimeActor {
    actor_id: ID!
    actor_name: String
    image_url: String
    language_name: String
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
    id: ID!
  }

  type AnimeLicensor {
    id: ID!
    licensor: String!
  }

  type AnimeGenre {
    id: ID!
    genre: String!
  }

  type AnimeProducer {
    id: ID!
    producer: String!
  }

  type AnimeStudio {
    id: ID!
    studio: String!
  }

  type Query {
    getAnimes(search: String, page: Int, limit: Int): AnimeResult
    getAnime(animeId: ID!): Anime
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
