import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { postgraphile } from "postgraphile";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
// @ts-ignore
import PgOrderByRelatedPlugin from "@graphile-contrib/pg-order-by-related";
import { RemoveForeignKeyFieldsPlugin } from "postgraphile-remove-foreign-key-fields-plugin";
import { PgMutationUpsertPlugin } from "postgraphile-upsert-plugin";
import { isAuth } from "./middleware/isAuth.js";
import dotenv from "dotenv";
import { setAuthCookies, deleteAuthCookies } from "./utils/AuthHelpers.js";
dotenv.config();

const app = express();

interface ISettings {
  role?: string;
  "jwt.claims.user_id"?: string;
  "jwt.claims.role"?: string;
}

app.use(cookieParser());
app.use(express.json() as RequestHandler);
app.use(express.urlencoded() as RequestHandler);
app.use(morgan("dev") as RequestHandler);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
  })
);
app.post("/login", async (req, res) => {
  try {
    await setAuthCookies(req, res);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "An Unexpected Error Occured", success: false });
  }
  return res.status(200).json({ success: true });
});

app.post("/logout", async (req, res) => {
  try {
    await deleteAuthCookies(req, res);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "An Unexpected Error Occured", success: false });
  }
  return res.status(200).json({ success: true });
});
app.post("/logout");

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
      ConnectionFilterPlugin,
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
    allowExplain() {
      return true;
    },
    enableQueryBatching: true,
    legacyRelations: "omit",
    graphileBuildOptions: {
      connectionFilterAllowNullInput: true,
      connectionFilterAllowEmptyObjectInput: true,
    },
  }) as RequestHandler
);
// eslint-disable-next-line no-unused-vars
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(err);
  }
);
app.listen({ port: 4000 }, () => {
  /* eslint-disable-next-line no-console */
  console.log(`🚀 Server ready at http://localhost:4000/graphiql`);
});
