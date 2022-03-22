import { Request, Response, CookieOptions } from "express";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { FirebaseError } from "firebase-admin";
import fetch from "node-fetch";
import add from "date-fns/add/index.js";
import dotenv from "dotenv";
import fb from "../lib/fb.js";
dotenv.config();
const FIREBASE_ERROR_TOKEN_EXPIRED = "auth/id-token-expired";
const FIREBASE_ENDPOINT_GET_TOKEN = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`;
const FIREBASE_ENDPOINT_CUSTOM_TOKEN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`;

// const addCustomClaims = async (req: Request, res: Response) => {
//   const { idToken } = req.body;
//   const auth = getAuth(fb);
//   const claims = await auth.verifyIdToken(idToken);
//   if (typeof claims.email !== "undefined") {

//     // const { role } = await client.query(query).toPromise()
//     await auth.setCustomUserClaims(claims.uid, { role });
//     res.json({ status: "success" });
//   } else {
//     res.json({ status: "ineligible" });
//   }
// };

const query = `
 query GetUser($userId: String!){
  getUser(uId: $userId) {
    role
  }
}
`;

interface CustomVerifyIdToken {
  firebaseUser: DecodedIdToken;
  token: string;
}

const customVerifyIdToken = async (
  token: string,
  refreshToken: string | null = null
): Promise<CustomVerifyIdToken> => {
  let newToken: string = "";
  let firebaseUser: DecodedIdToken;
  const auth = getAuth(fb);
  try {
    firebaseUser = await auth.verifyIdToken(token);
  } catch (err: any) {
    const error = err as FirebaseError;
    if (refreshToken && error.code === FIREBASE_ERROR_TOKEN_EXPIRED) {
      newToken = await refreshExpiredIdToken(refreshToken);
      firebaseUser = await auth.verifyIdToken(newToken);
    } else {
      throw error;
    }
  }
  return { firebaseUser, token: newToken };
};

interface FirebaseRequestBody {
  grant_type: string;
  refresh_token: string;
}

interface FirebaseExchangeRefreshForIdTokenResponse {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}
const refreshExpiredIdToken = async (
  refreshToken: string | null
): Promise<string> => {
  if (!refreshToken) {
    throw new Error("A refresh token is requried");
  }

  const requestBody: FirebaseRequestBody = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };
  const response = await fetch(FIREBASE_ENDPOINT_GET_TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  const responseJSON =
    (await response.json()) as FirebaseExchangeRefreshForIdTokenResponse;
  if (!response.ok) {
    throw new Error("Unable to get id token");
  }
  const idToken = responseJSON.id_token;
  return idToken;
};

interface CustomTokenForIdRefreshBody {
  token: string;
  returnSecureToken: boolean;
}

interface CustomTokenForIdRefreshResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface CustomTokenIdAndRefreshToken {
  idToken: string;
  refreshToken: string;
  firebaseUser: DecodedIdToken;
}

interface Me {
  data: {
    getUser: {
      role: string;
    };
  };
}

const getCustomIdAndRefreshToken = async (
  token: string,
  reqRefreshToken: string | null = null
): Promise<CustomTokenIdAndRefreshToken> => {
  const auth = getAuth(fb);
  const { firebaseUser } = await customVerifyIdToken(token, reqRefreshToken);
  const variables = { userId: firebaseUser.uid };
  const client = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const result = (await client.json()) as Me;
  const role = result.data.getUser.role;
  const customToken = await auth.createCustomToken(firebaseUser.uid, { role });
  const requestBody: CustomTokenForIdRefreshBody = {
    token: customToken,
    returnSecureToken: true,
  };
  const refreshTokenResponse = await fetch(FIREBASE_ENDPOINT_CUSTOM_TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  const refreshTokenJson =
    (await refreshTokenResponse.json()) as CustomTokenForIdRefreshResponse;
  if (!refreshTokenResponse.ok) {
    throw new Error("Unable to get refresh token");
  }

  const { idToken, refreshToken } = refreshTokenJson;
  return {
    idToken,
    refreshToken,
    firebaseUser,
  };
};

const setAuthCookies = async (
  req: Request,
  res: Response,
  reqToken: string | null = null
) => {
  const token =
    req?.headers?.authorization?.split(" ")[1] ??
    getCookie(req, "idt") ??
    reqToken;
  const reqRefreshToken = getCookie(req, "rft");

  if (token == null) {
    throw new Error("Authorization header is missing the token");
  }
  const { idToken, refreshToken } = await getCustomIdAndRefreshToken(
    token,
    reqRefreshToken
  );
  const newDateTimeIdToken = add(new Date(), { hours: 1 });
  const newDateTimeRefreshToken = add(new Date(), { days: 14 });
  const idTokenCookieOpt: CookieOptions = {
    httpOnly: true,
    secure: false,
    expires: newDateTimeIdToken,
  };
  const refreshTokenCookieOpt: CookieOptions = {
    httpOnly: true,
    expires: newDateTimeRefreshToken,
  };
  res.cookie("idt", idToken, idTokenCookieOpt);
  res.cookie("rft", refreshToken, refreshTokenCookieOpt);
  return idToken;
};

const deleteAuthCookies = async (req: Request, res: Response) => {
  res.clearCookie("idt");
  res.clearCookie("rft");
};

const getCookie = (req: Request, name: string) => {
  return req.cookies[name];
};

interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

const getTokens = async (req: Request, res: Response): Promise<Tokens> => {
  let accessToken = getCookie(req, "idt");
  const refreshToken = getCookie(req, "rft");
  if (!accessToken && !refreshToken) {
    return { accessToken: null, refreshToken: null };
  }

  if (refreshToken) {
    const idToken = await refreshExpiredIdToken(refreshToken);
    accessToken = await setAuthCookies(req, res, idToken);
  }
  return { accessToken, refreshToken };
};

export {
  customVerifyIdToken,
  refreshExpiredIdToken,
  getCustomIdAndRefreshToken,
  setAuthCookies,
  getCookie,
  deleteAuthCookies,
  getTokens,
};
