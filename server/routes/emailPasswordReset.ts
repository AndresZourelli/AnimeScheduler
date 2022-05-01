import { Response, Router } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import {
  getUserById,
  signIn,
  updateEmailOrPassword,
} from "supertokens-node/recipe/emailpassword";
import { PrivateUser } from "../objection/models/user";

let router = Router();

router.post("/change-password", async (req: SessionRequest, res: Response) => {
  let session = req.session;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  let userId = session!.getUserId();
  let userInfo = await getUserById(userId);

  if (userInfo === undefined) {
    return res.status(500).send({ error: "Unknown error occured" });
  }

  let isPasswordValid = await signIn(userInfo.email, oldPassword);
  if (isPasswordValid.status !== "OK") {
    return res.status(401).send({ error: "Unauthorized" });
  }
  let response = await updateEmailOrPassword({
    userId,
    password: newPassword,
  });
  if (response.status !== "OK") {
    return res.status(500).send({ error: "An error occurred" });
  }

  return res.status(200).send({ status: "success" });
});

router.post("/change-email", async (req: SessionRequest, res: Response) => {
  let session = req.session;
  let password = req.body.password;
  let newEmail = req.body.newEmail;

  let userId = session!.getUserId();
  let userInfo = await getUserById(userId);

  if (userInfo === undefined) {
    return res.status(500).send({ error: "Unknown error occured" });
  }

  let isPasswordValid = await signIn(userInfo.email, password);
  if (isPasswordValid.status !== "OK") {
    return res.status(401).send({ error: "Unauthorized" });
  }

  let response = await updateEmailOrPassword({
    userId,
    email: newEmail,
  });

  if (response.status !== "OK") {
    return res.status(500).send({ error: "An error occurred" });
  }

  const updateEmail = await PrivateUser.query()
    .findById(userId)
    .patch({ email: newEmail })
    .withSchema("anime_app_private");

  return res.status(200).send({ status: "success" });
});

export { router as emailPasswordResetRouter };
