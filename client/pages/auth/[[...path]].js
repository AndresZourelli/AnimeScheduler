import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import SuperTokens from "supertokens-auth-react";
import { redirectToAuth } from "supertokens-auth-react/recipe/emailpassword";

const SuperTokensComponentNoSSR = dynamic(
  new Promise((res) => res(SuperTokens.getRoutingComponent)),
  { ssr: false }
);

export default function Auth() {
  console.log("first");
  useEffect(() => {
    if (SuperTokens.canHandleRoute() === false) {
      redirectToAuth();
    }
  }, []);

  return (
    <Box>
      <SuperTokensComponentNoSSR />
    </Box>
  );
}
