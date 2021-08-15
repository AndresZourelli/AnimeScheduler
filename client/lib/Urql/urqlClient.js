import { createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { authExchange } from "@urql/exchange-auth";
import firebase from "../../firebase/firebaseInit";
import { gql } from "@urql/core";

const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          createUserAnime(_result, args, cache, _info) {
            const fragment = gql`
              fragment AllAnimesTileFragment on AllAnimesTile {
                id
                likes
              }
            `;

            cache.writeFragment(fragment, {
              id: args.input.userAnime.animeId,
              likes: true,
            });
          },
          deleteUserAnime(_result, args, cache, _info) {
            const fragment = gql`
              fragment AllAnimesTileFragment on AllAnimesTile {
                id
                likes
              }
            `;

            cache.writeFragment(fragment, {
              id: args.input.animeId,
              likes: false,
            });
          },
        },
      },
    }),
    authExchange({
      getAuth: async () => {
        if (firebase.apps.length === 0) {
          return;
        }

        if (!firebase.auth().currentUser) {
          return;
        }

        const token = await firebase.auth().currentUser.getIdToken();
        return { token };
      },
      addAuthToOperation: ({ authState, operation }) => {
        if (!authState || !authState.token) {
          return operation;
        }

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
              Authorization: authState.token,
            },
          },
        });
      },
    }),
    fetchExchange,
  ],
});

export default client;
