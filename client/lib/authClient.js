import { useEffect, useState, createContext, useContext } from "react";
import jwt_decode from "jwt-decode";
import { getAccessToken, setAccessToken } from "@/lib/accessToken";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
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
        const decoded = jwt_decode(token);
        setUser((prevState) => ({
          ...prevState,
          token,
          userId: decoded.userId,
          isAuthenticated: true,
          username: decoded.username,
        }));
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
  };

  const value = { user, logoutUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
