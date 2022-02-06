import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";
import fb from "../lib/fb.js";

dotenv.config();

interface ExtendedRequest extends Request {
  user?: {
    id?: string;
    role?: string;
  };
}

const isAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req?.headers?.authorization?.split(" ")[1];
  if (accessToken == null || accessToken === undefined) {
    return next();
  }

  try {
    const auth = getAuth(fb);
    const user = await auth.verifyIdToken(accessToken);
    req.user = {};
    req.user.id = user.uid;
    req.user.role = user.role;
    return next();
  } catch (e) {
    console.log(e);
    return next();
  }
};

export { isAuth };
