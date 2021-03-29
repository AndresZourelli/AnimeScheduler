import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@/lib/apolloClient";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "@/styles/theme";
import Nav from "@/components/Nav";

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={customTheme}>
        <Nav />
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
