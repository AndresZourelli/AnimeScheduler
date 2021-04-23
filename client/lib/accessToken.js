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
  const token = await axios.post(
    "http://localhost:4000/graphql",
    {
      query: `
        mutation GetAccessToken {
            getAccessToken {
              success
              token
            }
          }
        `,
    },

    { withCredentials: true, credentials: "include" }
  );
  console.log(token?.data?.data);
  if (
    token?.data?.data?.getAccessToken?.token &&
    token?.data?.data?.getAccessToken?.success
  ) {
    setAccessToken(token.data.data.getAccessToken.token);
  }
};

export const TokenRefresh = async () => {
  if (isTokenValid()) {
    return getAccessToken();
  } else {
    await fetchAccessToken();
  }
};
