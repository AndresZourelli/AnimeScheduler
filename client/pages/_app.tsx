import Nav from "@/components/Common/Nav";
import { AppAuthProvider } from "@/lib/Auth/FirebaseAuth";
import client from "@/lib/Urql/urqlClient";
import customTheme from "@/styles/theme";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { Provider } from "urql";

if (typeof window !== "undefined") {
  SuperTokens.init({
    appInfo: {
      appName: "test",
      apiDomain: "http://localhost:4000",
      websiteDomain: "http://localhost:3001",
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init({
        useShadowDom: false,
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "username",
                label: "Username",
                placeholder: "Choose a username",
              },
            ],
          },
        },
      }),
      Session.init(),
    ],
  });
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={customTheme}>
      <Provider value={client}>
        <AppAuthProvider>
          <DndProvider debugMode={true} backend={HTML5Backend}>
            <Box minH="100vh" display="flex" flexDirection="column">
              <Nav />
              <Component {...pageProps} />
            </Box>
          </DndProvider>
        </AppAuthProvider>
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
