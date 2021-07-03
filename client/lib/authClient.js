import { useEffect, useState, createContext, useContext } from "react";
import jwt_decode from "jwt-decode";
import { gql, useMutation } from "@apollo/client";
import { getAccessToken, setAccessToken } from "@/lib/accessToken";

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [logoutRequest, { data: logoutResponse }] = useMutation(LOGOUT);
  const [user, setUser] = useState({
    userId: null,
    username: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      try {
        setUserData(token);
      } catch (e) {
        console.log("Token Error");
      }
    }
  }, []);

  const logoutUser = () => {
    setUser({
      userId: null,
      token: null,
      isAuthenticated: false,
    });
    setAccessToken("");
    logoutRequest();
  };

  const loginUser = (token) => {
    setUserData(token);
    setAccessToken(token);
  };

  const setUserData = (token) => {
    const decoded = jwt_decode(token);
    setUser((prevState) => ({
      ...prevState,
      token,
      userId: decoded.userId,
      isAuthenticated: true,
      username: decoded.username,
    }));
  };

  const value = { user, logoutUser, loginUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
