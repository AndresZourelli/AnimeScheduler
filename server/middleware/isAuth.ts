import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";
import fb from "../lib/fb.js";
import {
  customVerifyIdToken,
  getCookie,
  getTokens,
  refreshExpiredIdToken,
} from "../utils/AuthHelpers.js";

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
  const { accessToken, refreshToken } = await getTokens(req, res);
  if (accessToken == null && refreshToken == null) {
    return next();
  }
  try {
    const { firebaseUser } = await customVerifyIdToken(accessToken as string);
    req.user = {};
    req.user.id = firebaseUser.uid;
    req.user.role = firebaseUser.role;
    return next();
  } catch (e) {
    return next();
  }
};

export { isAuth };
