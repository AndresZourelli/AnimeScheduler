import dotenv from "dotenv";
// @ts-ignore
import PgOrderByRelatedPlugin from "@graphile-contrib/pg-order-by-related";
import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import { Request, Response } from "express";
import { makePluginHook, PostGraphileOptions } from "postgraphile";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import { RemoveForeignKeyFieldsPlugin } from "postgraphile-remove-foreign-key-fields-plugin";
import { PgMutationUpsertPlugin } from "postgraphile-upsert-plugin";
import { SessionRequest } from "supertokens-node/framework/express";
import { PrivateUser } from "../objection/models/user";
import { NotificationSubscriptionPlugin } from "../middleware/postgraphilePlugins/subscriptions/notifications";
import PgPubSub from "@graphile/pg-pubsub";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

dotenv.config();

interface ISettings {
  role: string;
  "session.user_id"?: string;
  "session.role"?: string;
}

const pluginHook = makePluginHook([PgPubSub]);

export const postgraphileConfig: PostGraphileOptions<Request, Response> = {
  pluginHook,
  subscriptions: true,
  websocketMiddlewares: [verifySession({ sessionRequired: false })],
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
    NotificationSubscriptionPlugin,
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
    return settings as any;
  },
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
