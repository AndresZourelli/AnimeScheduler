const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const yup = require("yup");
const bcrypt = require("bcryptjs");
const { sendRegisterEmail } = require("../SendEmails");
const { createAccessToken } = require("../CreateTokens");

const registerUserValidationSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .required()
    .test(
      "passwords-match",
      "Passwords must match",
      (value) => this.parent.password === value
    ),
});

const loginUserValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const AuthenticationPlugin = makeExtendSchemaPlugin((build) => ({
  typeDefs: gql`
    type Jwt {
      jwt: String!
    }

    type RegisterResult {
      success: Boolean!
    }

    input RegisterUserInput {
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    }

    input LoginUserInput {
      email: String!
      password: String!
    }

    extend type Mutation {
      registerUser(input: RegisterUserInput!): RegisterResult
      loginUser(input: LoginUserInput!): Jwt
    }
  `,
  resolvers: {
    Mutation: {
      registerUser: async (
        _query,
        { username, email, password, confirmPassword },
        context
      ) => {
        const { pgClient } = context;
        await pgClient.query(`SAVEPOINT graphql_register_$1`, [email]);

        try {
          await registerUserValidationSchema.validate(
            {
              username,
              email,
              password,
              confirmPassword,
            },
            { abortEarly: false }
          );
          const hashedPassword = await bcrypt.hash(password, 12);
          const {
            rows: [result],
          } = await pgClient.query(
            `INSERT INTO anime_app_private.temp_users (username, email, password) VALUES ($1, $2, $3) RETURNING verify_email_token`,
            [username, email, hashedPassword]
          );

          await sendRegisterEmail(result.verify_email_token, email);
          return {
            data: { success: true },
            query: build.$$isQuery,
          };
        } catch (err) {
          await pgClient.query(`ROLLBACK TO SAVEPOINT graphql_register_$1`, [
            email,
          ]);
          const errors = [];
          err.inner.forEach((e) => {
            errors.push({ name: e.path, message: e.message });
          });
          return errors;
        } finally {
          await pgClient.query(`RELEASE TO SAVEPOINT graphql_register_$1`, [
            email,
          ]);
        }
      },
      loginUser: async (_query, { email, password }, context) => {
        const { pgClient } = context;
        try {
          await loginUserValidationSchema.validate(
            { email, password },
            { abortEarly: false }
          );
          const {
            rows: [user],
          } = await pgClient.query(
            `SELECT * FROM anime_app_private.users WHERE email=$1`,
            [email]
          );

          const hashedPassword = await bcrypt.compare(password, user.password);
          if (!hashedPassword) {
            throw new Error("Username/Password incorrect");
          }
          const jwtToken = createAccessToken({ id: user.id, role: user.role });
          return { jwt: jwtToken };
        } catch (err) {
          const errors = [];
          err.inner.forEach((e) => {
            errors.push({ name: e.path, message: e.message });
          });
          return errors;
        }
      },
    },
  },
}));

module.exports = AuthenticationPlugin;
