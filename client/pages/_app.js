import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@/lib/apolloClient";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "@/styles/theme";

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={customTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
