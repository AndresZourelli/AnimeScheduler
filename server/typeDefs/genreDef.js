const { gql } = require("apollo-server-express");

const genreDef = gql`
  type Genre {
    _id: ID!
    genre_name: String!
  }

  type genreUpdateResponse {
    success: Boolean!
    message: String
    genre_id: ID
  }

  extend type Query {
    getGenres: [Genre]
    getGenre(genre_id: ID!): Genre
  }

  extend type Mutation {
    createGenre(genre_name: String): genreUpdateResponse!
    editGenre(genre_id: ID, genre_name: String): genreUpdateResponse!
    deleteGenre(genre_id: ID!): genreUpdateResponse!
  }
`;

module.exports = { genreDef };
