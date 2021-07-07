import Nav from "@/components/Common/Nav";
import { TokenRefresh } from "@/lib/accessToken";
import { useApollo } from "@/lib/apolloClient";
import { AuthProvider } from "@/lib/authClient";
import customTheme from "@/styles/theme";
import { ApolloProvider } from "@apollo/client";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    await TokenRefresh();
    setLoading(false);
  }, []);
  const client = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={customTheme}>
        <AuthProvider>
          {loading ? (
            // TODO: add loading symbol
            <Box>Loading...</Box>
          ) : (
            <AuthProvider>
              <Nav />
              <Component {...pageProps} />
            </AuthProvider>
          )}
        </AuthProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
