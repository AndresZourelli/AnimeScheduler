const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("./mongoDB/models/user");
const {
  createAccessToken,
  createRefreshToken,
} = require("./utils/CreateTokens");
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
    origin: "http://localhost:3001",
  })
);
app.use(isAuth);

app.get("/refresh_token", async (req, res) => {
  const token = req.cookies["refresh-token"];

  if (!token) {
    return res.send({ success: false, accessToken: "" });
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN);
  } catch (e) {
    return res.send({ success: false });
  }

  const findUser = await User.findById(decodedToken.userId);

  if (!findUser) {
    return res.send({ success: false });
  }

  if (findUser.refreshVerify !== decodedToken.refreshVerify) {
    return res.send({ success: false });
  }

  try {
    const refreshToken = createRefreshToken(findUser);
    const accessToken = createAccessToken(findUser);

    res.cookie("refresh-token", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      // path: "/refresh_token",
    });

    return res.send({ success: true, accessToken });
  } catch (e) {
    return res.send({ success: false, accessToken: "" });
  }
});

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
