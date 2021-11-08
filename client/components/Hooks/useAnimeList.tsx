import {
  useAddAnimeToListMutation,
  useAddAnimeToUserAnimeListMutation,
  useDeleteAnimeFromListMutation,
  useUserListsQuery,
  useUpsertUserWatchStatusMutation,
  useCreateNewListAddAnimeMutation,
  AnimeListPrivacy,
  AddAnimeToListMutation,
  Exact,
  DeleteAnimeFromListMutation,
  WatchingStatusEnum,
  useUpdateUserAnimeScoreMutation,
  useUpdateUserEpisodeCountMutation,
  useGetLastItemInCustomListQuery,
  GetLastItemInCustomListDocument,
} from "@/graphql";
import { useAuth, ExtendedUser } from "@/lib/Auth/FirebaseAuth";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState, MouseEvent } from "react";
import { useClient, UseMutationState } from "urql";
import { Lexico } from "@/utilities/lexicoHelperFunctions";

interface UserAnimeListInterface {
  id: string;
  privacy: AnimeListPrivacy;
  title: string;
}
interface UserAnimeListHook {
  addAnimeToList: (e: MouseEvent, animeId: string) => void;
  removeAnimeFromList: (e: MouseEvent, animeId: string) => void;
  AddToNewList: (e: MouseEvent, animeId: string) => void;
  AddToExistingList: (
    e: MouseEvent,
    animeId: string,
    animeListId: string
  ) => void;
  addAnimeResult: UseMutationState<
    AddAnimeToListMutation,
    Exact<{
      inputAnimeId: any;
      inputAnimeListId: any;
    }>
  >;
  removeAnimeResult: UseMutationState<
    DeleteAnimeFromListMutation,
    Exact<{
      animeId: any;
      animeListId: any;
    }>
  >;
  user: ExtendedUser | null;
  error: boolean;
  userAnimeLists: UserAnimeListInterface[];
  updateWatchStatus: (animeId: String, watchStatus: WatchingStatusEnum) => void;
  updateAnimeScore: (animeId: string, userScore: number) => void;
  updateEpisodeCount: (animeId: string, userEpisodesWatched: number) => void;
}

enum notificationType {
  none,
  animeAdded,
  animeRemoved,
  animeExists,
}

const DEFAULT_LIST = "default";

interface UseAnimeListInterface {
  inputAnimeId?: string | null;
  animeTitle?: string | null;
}

const useAnimeList = ({
  inputAnimeId = null,
  animeTitle = null,
}: UseAnimeListInterface): UserAnimeListHook => {
  const client = useClient();
  const { user } = useAuth();
  const toast = useToast();
  const [userAnimeLists, setUserAnimeLists] = useState<
    UserAnimeListInterface[]
  >([]);
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
  const [userAnimeScoreResult, mutationUserAnimeScore] =
    useUpdateUserAnimeScoreMutation();
  const [userEpisodeCountResult, mutationUserEpisodeCount] =
    useUpdateUserEpisodeCountMutation();
  const [lastItemInList, queryLastItemInList] = useGetLastItemInCustomListQuery(
    { variables: { animeListId: null } }
  );

  const [newListResult, createNewList] = useCreateNewListAddAnimeMutation();

  const updateEpisodeCount = (animeId: string, userEpisodesWatched: number) => {
    mutationUserEpisodeCount({
      animeId,
      userEpisodesWatched,
      userId: user.uid,
    });
  };

  const updateAnimeScore = (animeId: string, userScore: number) => {
    mutationUserAnimeScore({ animeId, userScore });
  };

  const updateWatchStatus = (
    animeId: String,
    watchStatus: WatchingStatusEnum
  ) => {
    addWatchStatus({
      animeId: animeId,
      userId: user.uid,
      watchStatus: watchStatus,
    });
  };

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
    client
      .query(
        GetLastItemInCustomListDocument,
        { animeListId: animeListId },
        { requestPolicy: "network-only" }
      )
      .toPromise()
      .then((lastResult) => {
        let newIndex = Lexico.positionBefore(Lexico.FIRST_POSITION);
        if (lastResult.data?.userAnimeLists?.nodes[0]?.animeIndex) {
          newIndex = Lexico.positionAfter(
            lastResult.data.userAnimeLists.nodes[0].animeIndex
          );
        }
        return addAnimeToUser({
          inputAnimeListId: animeListId,
          inputAnimeId: animeId,
          inputAnimeIndex: newIndex,
        }).then((result) => {
          if (result.error) {
            setNotification(notificationType.animeExists);
            setError(true);
          } else {
            setNotification(notificationType.animeAdded);
          }
        });
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
    updateWatchStatus,
    addAnimeResult,
    removeAnimeResult,
    user,
    error,
    userAnimeLists,
    updateEpisodeCount,
    updateAnimeScore,
  };
};

export default useAnimeList;
