const { gql } = require("apollo-server");

const genre_typeDefs = gql`
  type Genre {
    _id: ID!
    genre_name: String!
  }

  input genreInput {
    genre_id: ID!
    genre_name: String
    checked: Boolean!
  }

  type genreUpdateResponse {
    success: Boolean!
    message: String
    genre_id: ID
  }

  input genreInputRequest {
    genre_id: ID!
    data: genreInput
  }

  extend type Query {
    getGenres: [Genre]
    getGenre(genre_id: ID): Genre
  }

  extend type Mutation {
    createGenre(input: genreInput): genreUpdateResponse!
    editGenre(input: genreInputRequest): genreUpdateResponse!
    deletGgenre(genre_id: ID!): genreUpdateResponse!
  }
`;

module.exports = { genre_typeDefs };
