const express = require("express");
import { postgraphile } from "postgraphile";
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const postgraphilePluginConnectionFilter = require("postgraphile-plugin-connection-filter");
const PgSimplifyInflectorPlugin = require("@graphile-contrib/pg-simplify-inflector");
const PgOrderByRelatedPlugin = require("@graphile-contrib/pg-order-by-related");
const {
  RemoveForeignKeyFieldsPlugin,
} = require("postgraphile-remove-foreign-key-fields-plugin");
const { PgMutationUpsertPlugin } = require("postgraphile-upsert-plugin");
const isAuth = require("./middleware/isAuth");
require("dotenv").config();
require("./db/dbConfig");
const { addCustomClaims } = require("./utils/AuthHelpers");

const app = express();

interface ISettings {
  role?: string;
}

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
    ownerConnectionString: process.env.POSTGRES_DATABASE_URL_OWNER,
    retryOnInitFail: false,
    appendPlugins: [
      postgraphilePluginConnectionFilter,
      PgSimplifyInflectorPlugin,
      PgOrderByRelatedPlugin,
      RemoveForeignKeyFieldsPlugin,
      PgMutationUpsertPlugin,
    ],
    pgSettings: (req: any) => {
      const settings: ISettings = {};
      if (req.user) {
        settings["jwt.claims.user_id"] = req.user.id;
        settings["jwt.claims.role"] = req.user.role;
        settings.role = req.user.role;
      } else {
        settings.role = "anime_default";
      }
      console.log(settings);
      return settings as any;
    },
    subscriptions: true,
    setofFunctionsContainNulls: false,
    // ignoreRBAC: false,
    // ignoreIndexes: false,
    showErrorStack: "json",
    extendedErrors: [
      "severity",
      "code",
      "detail",
      "hint",
      "position",
      "internalPosition",
      "internalQuery",
      "where",
      "schema",
      "table",
      "column",
      "dataType",
      "constraint",
      "file",
      "line",
      "routine",
    ],
    exportGqlSchemaPath: "schema.graphql",
    allowExplain(req) {
      return true;
    },
    enableQueryBatching: true,
    legacyRelations: "omit",
  })
);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
});
app.listen({ port: 4000 }, () => {
  /* eslint-disable-next-line no-console */
  console.log(`🚀 Server ready at http://localhost:4000/graphiql`);
});
