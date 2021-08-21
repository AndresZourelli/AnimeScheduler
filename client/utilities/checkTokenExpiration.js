import jwt_decode from "jwt-decode";

export const checkTokenExpiration = (token) => {
  const decodedToken = jwt_decode(token);
  if (Date.now() >= decodedToken.exp * 1000) {
    return false;
  }
  return true;
};
