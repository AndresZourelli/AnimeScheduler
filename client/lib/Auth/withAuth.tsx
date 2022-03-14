/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import FullPageSpinner from "@/components/Common/FullPageSpinner";
import { useRouter } from "next/router";

export const withAuthPrivate = (
  WrappedComponent,
  options = { redirect: "/" }
) => {
  const hocComponent = ({ ...props }) => {
    const router = useRouter();
    const { user } = useAuth();

    if (!user.loggedIn) {
      router.replace("/login");
      return <FullPageSpinner />;
    }

    return <WrappedComponent {...props} />;
  };

  return hocComponent;
};

export const withAuthPublic = (
  WrappedComponent,
  options = { redirect: "/" }
) => {
  const hocComponent = ({ ...props }) => {
    const router = useRouter();
    const { user, loading } = useAuth();

    if (user.loggedIn) {
      router.replace("/");
      return <FullPageSpinner />;
    }

    return <WrappedComponent {...props} />;
  };

  return hocComponent;
};
