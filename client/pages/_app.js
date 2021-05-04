import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@/lib/apolloClient";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import customTheme from "@/styles/theme";
import Nav from "@/components/Nav";
import { setAccessToken, TokenRefresh } from "@/lib/accessToken";
import { AuthProvider } from "@/lib/authClient";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    // const result = await axios.get("http://localhost:4000/refresh_token", {
    //   withCredentials: true,
    // });
    // if (result && result.data && result.data.success && result.data.token) {
    //   setAccessToken(result.data.token);
    // }
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
