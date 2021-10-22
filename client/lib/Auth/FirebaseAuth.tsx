import FullPageSpinner from "@/components/Common/FullPageSpinner";
import { auth } from "@/firebase/firebaseInit";
import axios from "axios";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getIdToken,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  verifyPasswordResetCode,
  User,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useClient, useMutation } from "urql";

interface ExtendedUser extends User {
  role?: string | null;
  username?: string | null;
}

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

export const AppAuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registerUserResult, registerUserCall] = useMutation(REGISTER_USER);
  const client = useClient();

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await getIdToken(user);
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
        response = await createUserWithEmailAndPassword(auth, email, password);
      } else if (provider === "google") {
        const googleProvider = new GoogleAuthProvider();
        response = await signInWithRedirect(auth, googleProvider);
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
      let response: UserCredential;
      if (provider === "email") {
        response = await signInWithEmailAndPassword(auth, email, password);
      } else if (provider === "google") {
        const providerGoogle = new GoogleAuthProvider();
        response = await signInWithRedirect(auth, providerGoogle);
      } else {
        throw new Error("Invalid provider");
      }
      const user = response.user;
      const idToken = await getIdToken(user);
      const result = await axios.post("http://localhost:4000/setCustomClaims", {
        idToken: idToken,
      });
      if (result.data.status === "success") {
        const token = await getIdToken(user, true);
      }
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const logoutUser = () => {
    return signOut(auth);
  };

  const resetPasswordSendEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const verifyResetPasswordEmailCode = (code) => {
    return verifyPasswordResetCode(auth, code);
  };

  const resetPassword = async (code, password) => {
    return confirmPasswordReset(auth, code, password);
  };

  useEffect(() => {
    return onIdTokenChanged(auth, (user: ExtendedUser) => {
      if (user) {
        return user.getIdTokenResult().then((result) => {
          user.role = result.claims.role as string;
          setUser(user);
        });
      }
      setUser(user);
    });
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (user: ExtendedUser) => {
      if (user) {
        return user.getIdTokenResult().then((result) => {
          user.role = result.claims.role as string;
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
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
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
                  return getIdToken(auth.currentUser, true).then(() => {
                    let newUser: ExtendedUser = auth.currentUser;
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
  }, [registerUserCall, router]);

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

export const useAuth = (): any => useContext(AuthContext);
