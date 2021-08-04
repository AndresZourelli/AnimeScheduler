const express = require("express");
const { postgraphile } = require("postgraphile");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("./db/models/users.model");
const auth = require("./routes/auth/auth");
const {
  createAccessToken,
  createRefreshToken,
} = require("./utils/CreateTokens");
const isAuth = require("./middleware/isAuth");
const { jwtStrategy } = require("./middleware/passport");
require("dotenv").config();
require("./db/dbConfig");

const app = express();

passport.use("jwt", jwtStrategy);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
  })
);

app.use(isAuth);

app.use("/graphql", passport.authenticate("jwt", { session: false }));

app.use(
  postgraphile(process.env.POSTGRES_DATABASE_URL, "public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    pgSettings: (req) => {
      const settings = {};
      if (req.user) {
        settings["jwt.claims.user_id"] = req.user.id;
        settings["jwt.claims.role"] = req.user.role;
      }
      return settings;
    },
  })
);

app.use("/auth", auth);

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

  const findUser = await User.query().findById(decodedToken.userId);

  if (!findUser) {
    return res.send({ success: false });
  }

  if (findUser.refreshTokenKey !== decodedToken.refreshTokenKey) {
    return res.send({ success: false });
  }

  try {
    createRefreshToken(res, findUser);
    const accessToken = createAccessToken(findUser);

    return res.send({ success: true, accessToken });
  } catch (e) {
    return res.send({ success: false, accessToken: "" });
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen({ port: 4000 }, () => {
  /* eslint-disable-next-line no-console */
  console.log(`🚀 Server ready at http://localhost:4000/graphiql`);
});
