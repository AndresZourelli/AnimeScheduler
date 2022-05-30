import dynamic from "next/dynamic";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";

export const EmailPasswordAuthNoSSR = dynamic(
  new Promise<typeof EmailPassword.EmailPasswordAuth>((res) =>
    res(EmailPassword.EmailPasswordAuth)
  ),
  { ssr: false }
);
