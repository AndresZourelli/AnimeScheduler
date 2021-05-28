import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  from,
} from "@apollo/client";
import { TokenRefresh } from "./accessToken";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient;

let token;

const isServer = () => {
  return typeof window === "undefined";
};

const authMiddleware = new ApolloLink(async (operation, forward) => {
  const accessToken = isServer() ? token : await TokenRefresh();
  if (accessToken) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: accessToken ? `bearer ${accessToken}` : "",
      },
    }));
  }

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([authMiddleware, httpLink]),
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = (initialState = null, accessToken = null) => {
  token = accessToken;
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  if (typeof window === "undefined") {
    return _apolloClient;
  }

  apolloClient = apolloClient ?? _apolloClient;

  return apolloClient;
};

export const useApollo = (initialState) => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
};
