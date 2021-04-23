const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");
require("dotenv").config();
const isAuth = require("./middleware/isAuth");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(isAuth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res, next }) => ({ req, res, next }),
});

server.applyMiddleware({ app, cors: false });

app.listen({ port: 4000 }, () => {
  /* eslint-disable-next-line no-console */
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
