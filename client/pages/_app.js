import Nav from "@/components/Common/Nav";
import customTheme from "@/styles/theme";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import { AuthProvider } from "@/lib/Auth/FirebaseAuth";
import { Provider } from "urql";
import client from "@/lib/Urql/urqlClient";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  return (
    <ChakraProvider resetCSS theme={customTheme}>
      <Provider value={client}>
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
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
