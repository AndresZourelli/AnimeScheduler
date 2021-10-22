import {
  useAddAnimeToUserAnimeListMutation,
  useDeleteAnimeFromListMutation,
  useUserListsQuery,
  useUpsertUserWatchStatusMutation,
} from "@/graphql";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { useEffect, useState } from "react";

const useAnimeList = ({ inputAnimeId = null }) => {
  const { user } = useAuth();
  const [userAnimeLists, setUserAnimeLists] = useState([]);
  const [error, setError] = useState(false);
  const [notificationType, setNotification] = useState("none");

  const [userListResult, getAnimeListResult] = useUserListsQuery({
    pause: true,
  });
  const [addAnimeResult, addAnimeToUser] = useAddAnimeToUserAnimeListMutation();
  const [addWatchStatusResult, addWatchStatus] =
    useUpsertUserWatchStatusMutation();
  const [removeAnimeResult, removeAnimeFromUser] =
    useDeleteAnimeFromListMutation();

  const addAnimeToList = (e, animeId) => {
    e.stopPropagation();
    try {
      const animeListId = userAnimeLists.filter((item) => {
        return item.title === "default";
      })[0].id;

      // addAnimeToUser({ animeListId, animeId }).then(() => {
      //   addWatchStatus({ animeId: animeId, userId: user?.uid }).then(() => {
      //     setNotification("anime-added");
      //   });
      // });
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  const removeAnimeFromList = (e, animeId) => {
    e.stopPropagation();
    try {
      const animeListId = userAnimeLists.filter((item) => {
        return item.title === "default";
      })[0].id;
      removeAnimeFromUser({ animeListId, animeId }).then(() => {
        setNotification("anime-removed");
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!userListResult.fetching && userListResult.data) {
      setUserAnimeLists(userListResult.data.animeLists.nodes);
    }
  }, [userListResult]);

  useEffect(() => {
    if (user?.uid) {
      getAnimeListResult();
    }
  }, [user, getAnimeListResult]);

  return {
    addAnimeToList,
    removeAnimeFromList,
    notificationType,
    addAnimeResult,
    removeAnimeResult,
    user,
    error,
    userAnimeLists,
  };
};

export default useAnimeList;
