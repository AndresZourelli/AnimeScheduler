import Nav from "@/components/Common/Nav";
import { AppAuthProvider } from "@/lib/Auth/FirebaseAuth";
import client from "@/lib/Urql/urqlClient";
import customTheme from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "urql";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={customTheme}>
      <Provider value={client}>
        <AppAuthProvider>
          <>
            <Nav />
            <Component {...pageProps} />
          </>
        </AppAuthProvider>
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
