import Nav from "@/components/Common/Nav";
import customTheme from "@/styles/theme";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import { AuthProvider } from "@/lib/Auth/FirebaseAuth";
import { createClient, Provider } from "urql";
import firebase from "firebase/app";
import "firebase/auth";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: async () => {
    const token = firebase?.auth()?.currentUser?.getIdToken();
    return {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    };
  },
});

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
