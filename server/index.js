const express = require("express");
const { postgraphile } = require("postgraphile");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const postgraphilePluginConnectionFilter = require("postgraphile-plugin-connection-filter");
const PgSimplifyInflectorPlugin = require("@graphile-contrib/pg-simplify-inflector");
const PgOrderByRelatedPlugin = require("@graphile-contrib/pg-order-by-related");
const {
  RemoveForeignKeyFieldsPlugin,
} = require("postgraphile-remove-foreign-key-fields-plugin");
const isAuth = require("./middleware/isAuth");
require("dotenv").config();
require("./db/dbConfig");
const { addCustomClaims } = require("./utils/AuthHelpers");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
  })
);

app.post("/setCustomClaims", addCustomClaims);

app.use(morgan("dev"));

app.use("/graphql", isAuth);

app.use(
  postgraphile(process.env.POSTGRES_DATABASE_URL, "anime_app_public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    appendPlugins: [
      postgraphilePluginConnectionFilter,
      PgSimplifyInflectorPlugin,
      PgOrderByRelatedPlugin,
      RemoveForeignKeyFieldsPlugin,
    ],
    pgSettings: (req) => {
      const settings = {};
      if (req.user) {
        settings["jwt.claims.user_id"] = req.user.id;
        settings["jwt.role"] = req.user.role;
      } else {
        settings.role = "admin";
      }
      return settings;
    },
  })
);
app.use((err, req, res, next) => {
  console.log(err);
});
app.listen({ port: 4000 }, () => {
  /* eslint-disable-next-line no-console */
  console.log(`🚀 Server ready at http://localhost:4000/graphiql`);
});
