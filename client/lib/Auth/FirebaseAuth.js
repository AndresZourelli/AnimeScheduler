import firebaseInit from "../../firebase/firebaseInit";
import firebase from "firebase/app";
import "firebase/auth";
import { useEffect, useState, useContext, createContext } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useClient } from "urql";
import axios from "axios";

const REGISTER_USER = `
  mutation RegisterUser($userId: String!, $username: String!, $email: String!) {
    registerUser(
      input: { userId: $userId, username: $username, email: $email }
    ) {
      user {
        id
      }
    }
  }
`;

const GET_USER = `
  query GetUser($userId: String!) {
  getUser(uId: $userId) {
    username
  }
}
`;

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  firebaseInit();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registerUserResult, registerUserCall] = useMutation(REGISTER_USER);
  const client = useClient();

  const getToken = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const token = await user.getIdToken();
      return token;
    } else {
      return null;
    }
  };

  const registerUser = async (
    provider,
    username = null,
    email = null,
    password = null
  ) => {
    try {
      let response;
      if (provider === "email") {
        response = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
      } else if (provider === "google") {
        const providerGoogle = new firebase.auth.GoogleAuthProvider();
        response = await firebase.auth().signInWithRedirect(providerGoogle);
      } else {
        throw new Error("Invalid provider");
      }
      if (response.user) {
        await registerUserCall({
          userId: response.user.uid,
          username: username,
          email: response.user.email,
        });
        setUser(response.user);
        router.push("/");
      }
      throw new Error("Unable to register user");
    } catch (e) {
      console.log(e);
    }
  };

  const signInUser = async (provider, email = null, password = null) => {
    try {
      let response;
      if (provider === "email") {
        response = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
      } else if (provider === "google") {
        const providerGoogle = new firebase.auth.GoogleAuthProvider();
        response = await firebase.auth().signInWithRedirect(providerGoogle);
      } else {
        throw new Error("Invalid provider");
      }
      const idToken = await response.user.getIdToken();
      const result = await axios.post("http://localhost:4000/setCustomClaims", {
        idToken: idToken,
      });
      if (result.data.status === "success") {
        const token = await firebase.auth().currentUser.getIdToken(true);
      }
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const logoutUser = () => {
    return firebase.auth().signOut();
  };

  const resetPasswordSendEmail = (email) => {
    return firebase.auth().sendPasswordResetEmail(email);
  };

  const verifyResetPasswordEmailCode = (code) => {
    return firebase.auth().verifyPasswordResetCode(code);
  };

  const resetPassword = async (code, password) => {
    return firebase.auth().confirmPasswordReset(code, password);
  };

  useEffect(() => {
    return firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        return user.getIdTokenResult().then((result) => {
          user.role = result.claims.role;
          setUser(user);
        });
      }
      setUser(user);
    });
  }, []);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        return user.getIdTokenResult().then((result) => {
          user.role = result.claims.role;
          return client
            .query(GET_USER, { userId: user?.uid })
            .toPromise()
            .then((result) => {
              user.username = result.data.getUser.username;
              setUser(user);
              setLoading(false);
            });
        });
      }
      setUser(user);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        if (result.user) {
          return result.user.getIdToken().then((token) => {
            return axios
              .post("http://localhost:4000/setCustomClaims", {
                idToken: token,
              })
              .then((result) => {
                if (result.data.status === "success") {
                  return firebase
                    .auth()
                    .currentUser.getIdToken(true)
                    .then(() => {
                      router.push("/");
                    });
                }
              });
          });
        }
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
