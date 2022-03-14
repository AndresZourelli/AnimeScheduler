import FullPageSpinner from "@/components/Common/FullPageSpinner";
import { auth } from "@/firebase/firebaseInit";
import axios from "axios";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getIdToken,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  verifyPasswordResetCode,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "urql";
import { useMeQuery } from "@/graphql";

export interface User {
  role?: string;
  username?: string;
  userId?: string;
  loggedIn: boolean;
}

interface FirebaseAuthInterface {
  loading: boolean;
  user: User | null;
  registerUser: (
    provider: Provider,
    username?: string | null,
    email?: string | null,
    password?: string | null
  ) => Promise<void>;
  signInUser: (
    provider: Provider,
    email?: string | null,
    password?: string | null
  ) => Promise<void>;
  getToken: () => Promise<string>;
  logoutUser: () => Promise<void>;
  resetPasswordSendEmail: (email: string) => Promise<void>;
  verifyResetPasswordEmailCode: (code: string) => Promise<string>;
  resetPassword: (code: string, password: string) => Promise<void>;
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

const AuthContext = createContext<FirebaseAuthInterface>(
  {} as FirebaseAuthInterface
);

export enum Provider {
  GOOGLE = "google",
  EMAIL = "email",
}

export const AppAuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User>({ loggedIn: false });
  const [loading, setLoading] = useState(true);
  const [registerUserResult, registerUserCall] = useMutation(REGISTER_USER);
  const [meResult, meCall] = useMeQuery({ requestPolicy: "network-only" });

  const getToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if (user) {
      const token = await getIdToken(user);
      return token;
    } else {
      return null;
    }
  };

  const registerUser = async (
    provider: Provider,
    username: string | null = null,
    email: string | null = null,
    password: string | null = null
  ): Promise<void> => {
    try {
      let response;
      if (provider === Provider.EMAIL) {
        response = await createUserWithEmailAndPassword(auth, email, password);
      } else if (provider === Provider.GOOGLE) {
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

  const signInUser = async (
    provider: Provider,
    email: string | null = null,
    password: string | null = null
  ): Promise<void> => {
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
      const session = await axios.post(
        "http://localhost:4000/login",
        {},
        {
          headers: { Authorization: `Bearer ${idToken}` },
          withCredentials: true,
        }
      );
      if (session.status != 200) {
        throw new Error("Error logging in");
      }
      meCall();
      setLoading(false);
      setUser({ ...user, loggedIn: true });
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const logoutUser = async (): Promise<void> => {
    const session = await axios.post(
      "http://localhost:4000/logout",
      {},
      {
        withCredentials: true,
      }
    );
    if (session.status === 200) {
      setUser({ loggedIn: false });
      localStorage.removeItem("loggedIn");
      router.push("/");
    }
  };

  const resetPasswordSendEmail = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };

  const verifyResetPasswordEmailCode = (code: string): Promise<string> => {
    return verifyPasswordResetCode(auth, code);
  };

  const resetPassword = async (
    code: string,
    password: string
  ): Promise<void> => {
    return confirmPasswordReset(auth, code, password);
  };

  useEffect(() => {
    if (!meResult.fetching && meResult.data) {
      if (meResult.data.me) {
        setUser({ ...meResult.data.me, loggedIn: true });
        localStorage.setItem("loggedIn", "true");
      } else {
        if (localStorage.getItem("loggedIn")) {
          localStorage.removeItem("loggedIn");
          setUser({ loggedIn: false });
        }
      }
    } else if (!meResult.fetching && meResult?.error) {
      localStorage.removeItem("loggedIn");
    }
    setLoading(false);
  }, [meResult, router]);

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      setUser({ loggedIn: true });
      meCall();
    }
  }, [meCall]);

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
