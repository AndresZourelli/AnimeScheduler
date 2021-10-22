import { AnimeListQueryDocument } from "@/graphql";
import { gql, makeOperation } from "@urql/core";
import { devtoolsExchange } from "@urql/devtools";
import { authExchange } from "@urql/exchange-auth";
import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";
import { auth } from "../../firebase/firebaseInit";
import { checkTokenExpiration } from "../../utilities/checkTokenExpiration";

const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      keys: {
        UserList: (data) => null,
      },
      updates: {
        Mutation: {
          createUserAnimeList(_result, args: any, cache, _info) {
            const fragment = gql`
              fragment AllAnimesTileFragment on AllAnimesTile {
                id
                likes
              }
            `;
            cache.writeFragment(fragment, {
              id: args.input.userAnimeList.animeId,
              likes: true,
            });
          },
          deleteUserAnimeListByAnimeListIdAndAnimeId(
            _result,
            args: any,
            cache,
            _info
          ) {
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
          createAnimeList(_result: any, args: any, cache, _info) {
            console.log(_result);
            if (_result.createAnimeList) {
              cache.updateQuery(
                {
                  query: AnimeListQueryDocument,
                  variables: { userId: args.input.animeList.userId },
                },
                (data: any) => {
                  data.animeLists.nodes.push(_result.createAnimeList.animeList);
                  return data;
                }
              );
            }
          },
          AddAnimeToList(_result: any, args: any, cache, _info) {
            if (_result.allUserAnimes) {
              console.log(_result);
              // cache.updateQuery(
              //   {
              //     query: WatchingDocument,
              //     variables: { watchingStatus: args.watchingStatus },
              //   },
              //   (data: any) => {
              //     data.animeLists.nodes.push(_result.allUserAnimes.animeList);
              //     return data;
              //   }
              // );
            }
          },
        },
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
        if (!authState || !(authState as any).token) {
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
              Authorization: `Bearer ${(authState as any).token}`,
            },
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
