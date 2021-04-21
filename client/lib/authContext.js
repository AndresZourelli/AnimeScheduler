import { createContex, useState, useEffect, useContext } from "react";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import jwt_decode from "jwt-decode";

const AuthContext = createContex();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    token: null,
    loading: false,
    user: false,
  });

  const getRefreshToken = () => {};

  const getAccessToken = () => {};

  const setAccessToken = (accessToken) => {
    setUser((prevState) => ({ ...prevState, token: accessToken }));
  };

  const isTokenValid = () => {
    if (!user.token) {
      return false;
    }
    try {
      const { exp } = jwt_decode(user.token);
      if (Date.now() >= exp * 1000) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const logoutUser = () => {
    setUser({ isLoggedIn: false, token: null });
    localStorage.removeItem("refresh-token");
  };

  useEffect(() => {}, []);

  const value = { loginUser, logoutUser, user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
