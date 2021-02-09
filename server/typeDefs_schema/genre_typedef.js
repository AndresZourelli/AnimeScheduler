const { gql } = require("apollo-server");

const genre_typeDefs = gql`
  type Genre {
    genre_id: ID!
    genre_name: String!
  }

  input genreInput {
    genre_id: ID!
    genre_name: String
    checked: Boolean!
  }

  extend type Query {
    getGenres: [Genre]
  }

  type GenreUpdateResponse {
    success: Boolean!
    message: String
    genre_id: ID
  }

  input genreInputRequest {
    genre_id: ID!
    data: genreInput
  }

  extend type Mutation {
    createGenre(input: genreInput): GenreUpdateResponse!
    editGenre(input: genreInputRequest): GenreUpdateResponse!
    deletGgenre(genre_id: ID!): GenreUpdateResponse!
  }
`;

module.exports = { genre_typeDefs };
