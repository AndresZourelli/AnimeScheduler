import { gql, makeOperation } from "@urql/core";
import { devtoolsExchange } from "@urql/devtools";
import { authExchange } from "@urql/exchange-auth";
import { cacheExchange, Data } from "@urql/exchange-graphcache";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "urql";
import { relayPagination } from "@urql/exchange-graphcache/extras";
import { createClient as createWSClient } from "graphql-ws";
import { checkTokenExpiration } from "../../utilities/checkTokenExpiration";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

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

const wsClient =
  typeof window != "undefined"
    ? createWSClient({
        url: "ws://localhost:4000/graphql",
      })
    : null;

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
        MeType: (data) => data.userId as string,
      },
    }),
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
    fetchExchange,
  ],
});

export default client;
