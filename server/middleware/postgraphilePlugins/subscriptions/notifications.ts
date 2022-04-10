import { makeExtendSchemaPlugin, gql, embed } from "graphile-utils";

const currentUserTopicFromContext = async (
  _args: any,
  context: any,
  _resolveInfo: any
) => {
  const { rows } = await context.pgClient.query(
    "select anime_app_public.current_user() as id"
  );
  const userId = rows?.[0]?.id;
  if (userId) {
    return `notification:user:${userId}`;
  } else {
    throw new Error("You're not logged in");
  }
};

export const NotificationSubscriptionPlugin = makeExtendSchemaPlugin(
  ({ pgSql: sql }) => ({
    typeDefs: gql`
    
    type NotificationEvent {
        event: String
        notification: UserNotification
    }

    extend type Subscription {
        notificationEvent: NotificationEvent @pgSubscription(topic: ${embed(
          currentUserTopicFromContext
        )})
    }

    `,
    resolvers: {
      NotificationEvent: {
        async notification(
          event,
          _args,
          _context,
          { graphile: { selectGraphQLResultFromTable } }
        ) {
          const rows = await selectGraphQLResultFromTable(
            sql.fragment`anime_app_public.user_notifications`,
            (tableAlias, sqlBuilder) => {
              sqlBuilder.where(
                sql.fragment`${tableAlias}.id = ${sql.value(
                  event.notification_id
                )}`
              );
            }
          );
          return rows[0];
        },
      },
    },
  })
);
