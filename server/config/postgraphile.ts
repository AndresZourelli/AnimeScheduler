import dotenv from "dotenv";
// @ts-ignore
import PgOrderByRelatedPlugin from "@graphile-contrib/pg-order-by-related";
import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import { RemoveForeignKeyFieldsPlugin } from "postgraphile-remove-foreign-key-fields-plugin";
import { PgMutationUpsertPlugin } from "postgraphile-upsert-plugin";
import { SessionRequest } from "supertokens-node/framework/express";
import { PrivateUser } from "../objection/models/user";
dotenv.config();

interface ISettings {
  role: string;
  "session.user_id"?: string;
  "session.role"?: string;
}

export const postgraphileConfig: PostGraphileOptions<Request, Response> = {
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
  pgSettings: async (req: SessionRequest) => {
    const settings: ISettings = { role: "anime_default" };
    const userId = req.session?.getUserId();
    if (userId) {
      const roles = await PrivateUser.relatedQuery("role")
        .for(userId)
        .withSchema("anime_app_private");
      settings["session.user_id"] = userId;
      // @ts-ignore
      settings.role = roles[0]?.role_name;
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
  allowExplain() {
    return true;
  },
  enableQueryBatching: true,
  legacyRelations: "omit",
  graphileBuildOptions: {
    connectionFilterAllowNullInput: true,
    connectionFilterAllowEmptyObjectInput: true,
  },
};
