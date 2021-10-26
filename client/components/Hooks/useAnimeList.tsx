import {
  useAddAnimeToListMutation,
  useAddAnimeToUserAnimeListMutation,
  useDeleteAnimeFromListMutation,
  useUserListsQuery,
  useUpsertUserWatchStatusMutation,
  useCreateNewListAddAnimeMutation,
} from "@/graphql";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState, MouseEvent } from "react";

interface AddAnimeInput {
  e: MouseEvent;
  animeId: String;
}

enum notificationType {
  none,
  animeAdded,
  animeRemoved,
  animeExists,
}

const DEFAULT_LIST = "default";

const useAnimeList = ({ inputAnimeId = null, animeTitle }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [userAnimeLists, setUserAnimeLists] = useState([]);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState<notificationType>(
    notificationType.none
  );

  const [animeToExisitingList, addAnimeToExisitingList] =
    useAddAnimeToUserAnimeListMutation();
  const [userListResult, getAnimeListResult] = useUserListsQuery({
    pause: true,
  });
  const [addAnimeResult, addAnimeToUser] = useAddAnimeToListMutation();
  const [addWatchStatusResult, addWatchStatus] =
    useUpsertUserWatchStatusMutation();
  const [removeAnimeResult, removeAnimeFromList] =
    useDeleteAnimeFromListMutation();

  const [newListResult, createNewList] = useCreateNewListAddAnimeMutation();

  const AddToExistingList = (
    e: MouseEvent,
    animeId: String,
    animeListId: String
  ) => {
    e.stopPropagation();

    addAnimeToExisitingList({
      animeId: animeId,
      animeListId: animeListId,
    }).then((result) => {
      if (result.error) {
        setNotification(notificationType.animeExists);
        setError(true);
      } else {
        setNotification(notificationType.animeAdded);
      }
    });
  };

  const AddToNewList = (e: MouseEvent, animeId: String) => {
    e.stopPropagation();

    createNewList({ animeidinput: animeId }).then((result) => {
      if (result.error) {
        setNotification(notificationType.animeExists);
        setError(true);
      } else {
        setNotification(notificationType.animeAdded);
      }
    });
  };

  const addAnimeToList = (e: MouseEvent, animeId: String) => {
    e.stopPropagation();
    const animeListId = userAnimeLists.find(
      (item) => item.title === DEFAULT_LIST
    ).id;
    addAnimeToUser({ animeListId, animeId }).then((result) => {
      if (result.error) {
        setNotification(notificationType.animeExists);
        setError(true);
      } else {
        setNotification(notificationType.animeAdded);
      }
    });
  };

  const removeAnimeFromListCall = (e: MouseEvent, animeId: String) => {
    e.stopPropagation();

    const animeListId = userAnimeLists.find(
      (item) => item.title === DEFAULT_LIST
    ).id;
    removeAnimeFromList({ animeListId, animeId }).then((result) => {
      if (result.error) {
        setNotification(notificationType.animeExists);
        setError(true);
      } else {
        setNotification(notificationType.animeRemoved);
      }
    });
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

  useEffect(() => {
    if (notification === notificationType.animeAdded) {
      toast({
        title: `Anime Added!`,
        description: `${animeTitle} successfully added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      setNotification(notificationType.none);
    } else if (notification === notificationType.animeRemoved) {
      toast({
        title: `Removed Anime!`,
        description: `${animeTitle} removed from list.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      setNotification(notificationType.none);
    } else if (notification === notificationType.animeExists) {
      toast({
        title: `Anime Exists!`,
        description: `${animeTitle} anime already added.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      setNotification(notificationType.none);
    }
  }, [addAnimeResult, error, toast, notification, animeTitle]);

  return {
    addAnimeToList,
    removeAnimeFromList: removeAnimeFromListCall,
    AddToNewList,
    AddToExistingList,
    addAnimeResult,
    removeAnimeResult,
    user,
    error,
    userAnimeLists,
  };
};

export default useAnimeList;
