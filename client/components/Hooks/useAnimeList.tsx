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
  useUpdateUserAnimeScoreMutation,
  useUpdateUserEpisodeCountMutation,
  GetLastItemInCustomListDocument,
  WatchStatusTypes,
  UserListsQuery,
} from "@/graphql";
import { useAuth, User } from "@/lib/Auth/Auth";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useClient, UseMutationState } from "urql";
import { Lexico } from "@/utilities/lexicoHelperFunctions";

interface UserAnimeListInterface {
  id?: string;
  privacy?: AnimeListPrivacy;
  title?: string;
  listId?: string;
  listName?: string;
  coverImage?: string;
}
interface UserAnimeListHook {
  addAnimeToList: (e: React.MouseEvent, animeId: string) => void;
  removeAnimeFromList: (e: React.MouseEvent, animeId: string) => void;
  AddToNewList: (e: React.MouseEvent, animeId: string) => void;
  AddToExistingList: (
    e: React.MouseEvent,
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
  user: User;
  error: boolean;
  userAnimeLists: IUserAnimeList[];
  updateWatchStatus: (animeId: String, watchStatus: WatchStatusTypes) => void;
  updateAnimeScore: (animeId: string, userScore: number) => void;
  updateEpisodeCount: (animeId: string, userEpisodesWatched: number) => void;
  onClickUserEpisodeCount: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    numOfEpisodes: number,
    id: string
  ) => void;
  onChangeAnimeWatchStatus: (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => void;
  onChangeUserAnimeRating: (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => void;
  userEpisodeCount: number;
  userAnimeWatchStatus: WatchStatusTypes;
  userAnimeRating: number;
  setUserEpisodeCount: React.Dispatch<React.SetStateAction<number>>;
  setUserAnimeWatchStatus: React.Dispatch<React.SetStateAction<string>>;
  setUserAnimeRating: React.Dispatch<React.SetStateAction<number>>;
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

type IUserAnimeList = UserListsQuery["animeLists"]["nodes"][0];

const useAnimeList = ({
  inputAnimeId = null,
  animeTitle = null,
}: UseAnimeListInterface): UserAnimeListHook => {
  const client = useClient();
  const { user } = useAuth();
  const toast = useToast();
  const [userAnimeLists, setUserAnimeLists] = useState<IUserAnimeList[]>([]);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState<notificationType>(
    notificationType.none
  );
  const [userEpisodeCount, setUserEpisodeCount] = useState<number>(0);
  const [userAnimeWatchStatus, setUserAnimeWatchStatus] = useState(
    WatchStatusTypes.NotWatched
  );
  const [userAnimeRating, setUserAnimeRating] = useState(-1);

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

  const [newListResult, createNewList] = useCreateNewListAddAnimeMutation();

  const updateEpisodeCount = (animeId: string, userEpisodesWatched: number) => {
    mutationUserEpisodeCount({
      animeId,
      userEpisodesWatched,
      userId: user.userId,
    });
  };

  const updateAnimeScore = (animeId: string, userScore: number) => {
    mutationUserAnimeScore({ animeId, userScore });
  };

  const updateWatchStatus = (
    animeId: String,
    watchStatus: WatchStatusTypes
  ) => {
    addWatchStatus({
      animeId: animeId,
      userId: user.userId,
      watchStatus: watchStatus,
    });
  };

  const onClickUserEpisodeCount = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    numOfEpisodes: number,
    id: string
  ) => {
    e.stopPropagation();
    const target = e.currentTarget;
    let newCount = 0;
    if (target.name === "episodeIncrease") {
      let updatedCount = Number(userEpisodeCount) + 1;
      if (numOfEpisodes && updatedCount >= numOfEpisodes) {
        newCount = numOfEpisodes;
      } else {
        newCount = updatedCount;
      }
    } else if (target.name === "episodeDecrease") {
      let updatedCount = Number(userEpisodeCount) - 1;
      if (updatedCount <= 0 || !updatedCount) {
        newCount = 0;
      } else {
        newCount = updatedCount;
      }
    }
    setUserEpisodeCount(newCount);
    updateEpisodeCount(id, newCount);
  };

  const onChangeAnimeWatchStatus = (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    if (event.currentTarget.value != userAnimeWatchStatus) {
      setUserAnimeWatchStatus(event.currentTarget.value as WatchStatusTypes);
      updateWatchStatus(id, event.currentTarget.value as WatchStatusTypes);
    }
  };

  const onChangeUserAnimeRating = (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    const rawUserScore = Number(event.currentTarget.value);
    if (rawUserScore != userAnimeRating) {
      setUserAnimeRating(rawUserScore);
      updateAnimeScore(id, rawUserScore);
    }
  };

  const AddToExistingList = (
    e: React.MouseEvent,
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

  const AddToNewList = (e: React.MouseEvent, animeId: String) => {
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

  const addAnimeToList = (e: React.MouseEvent, animeId: String) => {
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

  const removeAnimeFromListCall = (e: React.MouseEvent, animeId: String) => {
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
    if (user?.userId) {
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
        variant: "solid",
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
        variant: "solid",
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
        variant: "solid",
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
    onClickUserEpisodeCount,
    onChangeUserAnimeRating,
    onChangeAnimeWatchStatus,
    userEpisodeCount,
    userAnimeWatchStatus,
    userAnimeRating,
    setUserEpisodeCount,
    setUserAnimeWatchStatus,
    setUserAnimeRating,
  };
};

export default useAnimeList;
