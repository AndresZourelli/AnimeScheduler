import Nav from "@/components/Common/Nav";
import { AppAuthProvider } from "@/lib/Auth/FirebaseAuth";
import client from "@/lib/Urql/urqlClient";
import customTheme from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
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
