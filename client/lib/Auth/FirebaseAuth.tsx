import FullPageSpinner from "@/components/Common/FullPageSpinner";
import { useMeQuery } from "@/graphql";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

export interface User {
  role?: string;
  username?: string;
  userId?: string;
  loggedIn: boolean;
  email?: string;
}

interface FirebaseAuthInterface {
  loading: boolean;
  user: User | null;
  removeUserInfo: () => void;
}

const AuthContext = createContext<FirebaseAuthInterface>(
  {} as FirebaseAuthInterface
);

export const AppAuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState<User>({ loggedIn: false });
  const [loading, setLoading] = useState(true);
  const [meResult, meCall] = useMeQuery({
    requestPolicy: "network-only",
    pause: true,
  });

  const removeUserInfo = () => {
    setUser({ loggedIn: false });
    localStorage.removeItem("loggedIn");
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
  }, [meResult]);

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      setUser({ loggedIn: true });
      meCall();
    }
  }, [meCall]);

  useEffect(() => {
    doesSessionExist().then((value) => {
      if (value) {
        meCall();
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        removeUserInfo,
      }}
    >
      {!loading ? children : <FullPageSpinner />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
