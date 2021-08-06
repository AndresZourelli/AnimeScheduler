import firebaseInit from "../../firebase/firebaseInit";
import { useEffect, useState, useContext, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { useRouter } from "next/router";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  firebaseInit();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const getToken = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const token = await user.getIdToken();
      return token;
    } else {
      return null;
    }
  };

  const registerUser = async (provider, email = null, password = null) => {
    try {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      let response;
      if (provider === "email") {
        response = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
      } else if (provider === "google") {
        response = await firebase.auth().signInWithPopup(provider);
      } else {
        throw new Error("Invalid provider");
      }

      setUser(response.user);
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const signInUser = async (provider, email = null, password = null) => {
    try {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      let response;
      if (provider === "email") {
        response = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
      } else if (provider === "google") {
        response = await firebase.auth().signInWithPopup(provider);
      } else {
        throw new Error("Invalid provider");
      }

      setUser(response.user);
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const logoutUser = async () => {
    try {
      await firebase.auth().signOut();
      setUser(null);
    } catch (e) {
      console.log(e);
    }
  };

  const resetPasswordSendEmail = async (email) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyResetPasswordEmailCode = async (code) => {
    try {
      const response = await firebase.auth().verifyPasswordResetCode(code);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const resetPassword = async (code, password) => {
    try {
      await firebase.auth().confirmPasswordReset(code, password);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async () => {
      if (!user) {
        setUser(null);
      }
      setUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerUser,
        signInUser,
        getToken,
        logoutUser,
        resetPasswordSendEmail,
        verifyResetPasswordEmailCode,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
