import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, RequestHandler, Response } from "express";
import Knex from "knex";
import morgan from "morgan";
import { Model } from "objection";
import { postgraphile } from "postgraphile";
import supertokens, { deleteUser } from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { knexConfig } from "./config/knex";
import { postgraphileConfig } from "./config/postgraphile";
import { supertokensConfig } from "./config/supertokens";
import { emailPasswordResetRouter } from "./routes/emailPasswordReset";

dotenv.config();

supertokens.init(supertokensConfig);

const knex = Knex(knexConfig["development"] as any);
Model.knex(knex);

let app = express();

app.use(cookieParser());
app.use(express.json() as RequestHandler);
app.use(express.urlencoded() as RequestHandler);
app.use(morgan("dev") as RequestHandler);

app.use(
  cors({
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
    origin: "http://localhost:3001",
  })
);

app.use(middleware());

app.use("/graphql", verifySession({ sessionRequired: false }));

app.use("/auth", verifySession(), emailPasswordResetRouter);

app.use(
  postgraphile(
    process.env.POSTGRES_DATABASE_URL,
    "anime_app_public",
    postgraphileConfig
  ) as RequestHandler
);

app.delete("/user/:id", async (req: Request, res: Response) => {
  let userId = req.params.id;
  try {
    await deleteUser(userId);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
  return res.status(204).send();
});

// app.get("/users", async (req: Request, res: Response) => {
//   try {
//     const result = await User.query().withSchema("anime_app_private").debug();
//     return res.status(204).send(result);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ error: error });
//   }
// });

app.use(errorHandler());

app.listen({ port: 4000 }, () => {
  /* eslint-disable-next-line no-console */
  console.log(`🚀 Server ready at http://localhost:4000/graphiql`);
});
