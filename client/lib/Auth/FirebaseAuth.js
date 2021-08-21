import FullPageSpinner from "@/components/Common/FullPageSpinner";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useClient, useMutation } from "urql";

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
    id: userId
    username
  }
}
`;

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
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
      console.log("onAuthStateChanged 1");
      if (user) {
        return user.getIdTokenResult().then((result) => {
          user.role = result.claims.role;
          return client
            .query(GET_USER, { userId: user?.uid })
            .toPromise()
            .then((_result) => {
              user.username = _result?.data?.getUser?.username || null;
              setUser(user);
              setLoading(false);
            });
        });
      }
      setUser(user);
      setLoading(false);
    });
  }, [client]);

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        console.log("getRedirectResult 1");
        if (result.user) {
          return registerUserCall({
            userId: result.user.uid,
            username: result.user.email.split("@")[0],
            email: result.user.email,
          }).then(() => {
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
                        let newUser = firebase.auth().currentUser;
                        newUser.username = newUser.email.split("@")[0];
                        setUser(newUser);
                        return router.push("/");
                      });
                  }
                });
            });
          });
        }
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
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
      {!loading ? children : <FullPageSpinner />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
