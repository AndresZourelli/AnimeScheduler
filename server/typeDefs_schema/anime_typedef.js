const { gql } = require('apollo-server');

const anime_typeDefs = gql`
	type Anime {
		id: ID!
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

	type Genre {
		genre_id: ID!
		genre_name: String!
	}

	type Licensor {
		licensor_id: ID!
		licensor_name: String!
	}

	type Producer {
		producer_id: ID!
		producer_name: String!
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

	type Type {
		type_id: ID!
		type_name: String!
	}

	type Query {
		animes: [Anime]
		anime(id: Int!): Anime
	}
`;

module.exports = { anime_typeDefs };
