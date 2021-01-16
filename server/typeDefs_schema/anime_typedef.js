const { gql } = require('apollo-server');

const anime_typeDefs = gql`
	type Anime {
		anime_id: ID!
		title: String
		score: Float
		description: String!
		image_url: String
		episodes: Int
		aired_start: String
		aired_end: String
		broadcast_day: String
		broadcast_time: String
		duration: Int
		type: Type
		season: Season
		source: Source
		status: Status
		rating_name: String
		rating_id: Int
		genres: [Genre]
		licensors: [Licensor]
		producers: [Producer]
		studios: [Studio]
		fk_type: Int
		fk_season: Int
		fk_source: Int
		fk_status: Int
		fk_rating: Int
	}

	input AnimeInput {
		title: String
		score: Float
		description: String
		image_url: String
		episodes: Int
		aired_start: String
		aired_end: String
		broadcast_day: String
		broadcast_time: String
		duration: Int
		fk_type: Int
		fk_season: Int
		fk_source: Int
		fk_status: Int
		fk_rating: Int
		names: [InputName]
		genres: [InputGenre]
		licensors: [InputLicensor]
		producers: [InputProducer]
		studios: [InputStudio]
	}

	type Names {
		alt_name_id: Int
		alt_name: String
		fk_anime_id: Int
	}

	input InputName {
		alt_name_id: Int
		alt_name: String
		checked: Boolean!
	}

	type Genre {
		genre_id: ID!
		genre_name: String!
	}

	input InputGenre {
		genre_id: ID!
		genre_name: String
		checked: Boolean!
		fk_genre_id: Int!
	}

	type Licensor {
		licensor_id: ID!
		licensor_name: String!
	}

	input InputLicensor {
		licensor_id: ID!
		licensor_name: String
		checked: Boolean!
		fk_licensor_id: Int!
	}

	type Producer {
		producer_id: ID!
		producer_name: String!
	}

	input InputProducer {
		producer_id: ID!
		producer_name: String
		checked: Boolean!
		fk_producer_id: Int!
	}

	type Rating {
		rating_id: ID!
		rating_name: String!
	}

	type Season {
		season_id: ID!
		season_date: String!
	}

	type Source {
		source_id: ID!
		source_name: String!
	}

	type Status {
		status_id: ID!
		status_name: String!
	}

	type Studio {
		studio_id: ID!
		studio_name: String!
	}

	input InputStudio {
		studio_id: ID!
		studio_name: String
		checked: Boolean!
		fk_studio_id: Int!
	}

	type Type {
		type_id: ID!
		type_name: String!
	}

	type Query {
		getAnimes: [Anime]
		getAnime(anime_id: Int!): Anime
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
