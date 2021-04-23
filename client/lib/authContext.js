import { createContext, useState, useEffect, useContext } from "react";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import jwt_decode from "jwt-decode";

const GET_ACCESS_TOKEN = gql`
  mutation GetAccessToken {
    getAccessToken {
      success
      token
    }
  }
`;

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    token: null,
    loading: false,
    user: false,
  });
  const [requestToken, { data: requestTokenResponse }] = useMutation(
    GET_ACCESS_TOKEN
  );

  const getToken = async () => {
    if (user.token) {
      if (isTokenValid(user.token)) {
        return user.token;
      } else {
        await requestToken();
        console.log(requestTokenResponse);
      }
    }
  };

  const setAccessToken = (accessToken) => {
    setUser((prevState) => ({ ...prevState, token: accessToken }));
  };

  const logoutUser = () => {
    setUser({ isLoggedIn: false, token: null });
    localStorage.removeItem("refresh-token");
  };

  const value = { logoutUser, getToken, setAccessToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
