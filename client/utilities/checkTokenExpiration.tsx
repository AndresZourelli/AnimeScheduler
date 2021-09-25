import jwt_decode, { JwtPayload } from "jwt-decode";

export const checkTokenExpiration = (token): Boolean => {
  const decodedToken = jwt_decode<JwtPayload>(token);
  if (Date.now() >= decodedToken.exp * 1000) {
    return false;
  }
  return true;
};
