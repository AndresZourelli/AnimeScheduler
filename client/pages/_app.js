import Nav from "@/components/Common/Nav";
import { useApollo } from "@/lib/apolloClient";
import customTheme from "@/styles/theme";
import { ApolloProvider } from "@apollo/client";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import { AuthProvider } from "@/components/Auth/FirebaseAuth";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const client = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={customTheme}>
        <AuthProvider>
          {loading ? (
            // TODO: add loading symbol
            <Box>Loading...</Box>
          ) : (
            <>
              <Nav />
              <Component {...pageProps} />
            </>
          )}
        </AuthProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
