const { gql } = require('apollo-server');

const anime_typeDefs = gql`
	type Anime {
		id: ID!
		name: String!
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
		rating: Rating
		genre: [Genre]
		licensors: [Licensor]
		producers: [Producer]
		studio: [Studio]
	}

	type Genre {
		id: ID!
		name: String!
	}

	type Licensor {
		id: ID!
		name: String!
	}

	type Producer {
		id: ID!
		name: String!
	}

	type Rating {
		id: ID!
		name: String!
	}

	type Season {
		id: ID!
		season_date: String!
	}

	type Source {
		id: ID!
		source_name: String!
	}

	type Status {
		id: ID!
		status_name: String!
	}

	type Studio {
		id: ID!
		studio_name: String!
	}

	type Type {
		id: ID!
		type_name: String!
	}
`;

module.exports = anime_typeDefs;
