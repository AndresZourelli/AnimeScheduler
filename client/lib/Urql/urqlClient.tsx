import { gql, makeOperation } from "@urql/core";
import { devtoolsExchange } from "@urql/devtools";
import { authExchange } from "@urql/exchange-auth";
import { cacheExchange, Data } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";
import { relayPagination } from "@urql/exchange-graphcache/extras";

import { auth } from "../../firebase/firebaseInit";
import { checkTokenExpiration } from "../../utilities/checkTokenExpiration";

interface ExtendedData extends Data {
  nodeId: string;
  genre?: string;
  mediaType?: string;
  airingStatusType?: string;
  sourceMaterialType?: string;
  producer?: string;
  studio?: string;
  ageRatingType?: string;
}

const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      resolvers: {
        Anime: {
          animeCharacters: relayPagination(),
          animeStaffs: relayPagination(),
        },
      },
      keys: {
        UserList: (data) => null,
        Image: (data) => null,
        StaffRole: (data) => null,
        AnimeCharacter: (data: ExtendedData) => data.nodeId,
        AnimeStaff: (data: ExtendedData) => data.nodeId,
        Genre: (data: ExtendedData) => data.genre,
        MediaFormat: (data: ExtendedData) => data.mediaType,
        AiringStatus: (data: ExtendedData) => data.mediaType,
        SourceMaterial: (data: ExtendedData) => data.sourceMaterialType,
        Producer: (data: ExtendedData) => data.producer,
        Studio: (data: ExtendedData) => data.studio,
        AgeRating: (data: ExtendedData) => data.ageRatingType,
        Me: (data) => data.userId as string,
      },
    }),
    authExchange({
      getAuth: async ({ authState }) => {
        const user = auth.currentUser;
        if (!authState) {
          if (!user) {
            return null;
          }

          const token = await user.getIdToken();
          return { token };
        }

        const token = await user.getIdToken();

        if (token) {
          return { token };
        }
        return null;
      },
      addAuthToOperation: ({ authState, operation }) => {
        const fetchOptions =
          typeof operation.context.fetchOptions === "function"
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};

        return makeOperation(operation.kind, operation, {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
            },
            credentials: "include",
          },
        });
      },
      willAuthError: ({ authState }) => {
        if (!authState || checkTokenExpiration((authState as any).token)) {
          return true;
        }
        return false;
      },
    }),
    fetchExchange,
  ],
});

export default client;
