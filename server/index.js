const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();

app.use(cors());

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.get("Authorization") || "";
    return { user: getUser(token.replace("Bearer", "")) };
  },
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
