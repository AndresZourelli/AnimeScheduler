import { TypeInput } from "supertokens-node/lib/build/types";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import dotenv from "dotenv";
import { PrivateUser, User } from "../objection/models/user";

dotenv.config();

export const supertokensConfig: TypeInput = {
  framework: "express",
  supertokens: {
    connectionURI: "http://localhost:3567",
  },
  appInfo: {
    appName: "anime_app",
    apiDomain: "http://localhost:4000",
    websiteDomain: "http://localhost:3001",
  },
  recipeList: [
    EmailPassword.init({
      override: {
        apis: (originalImplementation) => {
          return {
            ...originalImplementation,
            signUpPOST: async (input: any) => {
              if (originalImplementation.signUpPOST === undefined) {
                throw Error("Should never come here");
              }

              let response = await originalImplementation.signUpPOST(input);
              if (response.status === "OK") {
                let { id, email } = response.user;
                let username = input.formFields.find(
                  (inputField: any) => inputField.id === "username"
                )?.value;

                try {
                  const returnValue = await User.transaction(async (trx) => {
                    const user = await User.query()
                      .withSchema("anime_app_public")
                      .insert({ id } as any);

                    const test = await PrivateUser.query()
                      .withSchema("anime_app_private")
                      .insert({ email, username, user_id: id } as any);

                    return "success";
                  });
                } catch (error) {}
              }
              return response;
            },
          };
        },
      },
      signUpFeature: {
        formFields: [
          {
            id: "username",
          },
        ],
      },
    }),
    Session.init(),
  ],
};

// {
//       override: {
//         functions: (originalImplementation) => {
//           return {
//             ...originalImplementation,
//             createNewSession: async (input) => {
//               let role = "anime_user";
//               input.accessTokenPayload = {
//                 ...input.accessTokenPayload,
//                 role,
//               };
//               return originalImplementation.createNewSession(input);
//             },
//           };
//         },
//       },
//     }
