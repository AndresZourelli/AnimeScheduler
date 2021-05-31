import jwt_decode from "jwt-decode";
import axios from "axios";

let accessToken = "";

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const isTokenValid = () => {
  if (!accessToken) {
    return false;
  }
  try {
    const { exp } = jwt_decode(accessToken);
    if (Date.now() >= exp * 1000) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const fetchAccessToken = async () => {
  const token = await axios.get("http://localhost:4000/refresh_token", {
    withCredentials: true,
  });

  if (token?.data?.success && token?.data?.accessToken) {
    setAccessToken(token?.data?.accessToken);
  }
  return;
};

export const TokenRefresh = async () => {
  if (isTokenValid()) {
    return getAccessToken();
  } else {
    await fetchAccessToken();
    return;
  }
};
