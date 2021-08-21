import LoadImage from "@/components/Common/ImageLoader";
import PopupMenuButton from "@/components/Common/PopupMenuButton";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { Badge, Box, Heading, IconButton, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPlus, BsX } from "react-icons/bs";
import { useMutation, useQuery } from "urql";

const ADD_ANIME_TO_USER = `
  mutation AddAnimeToUserAnimeList($animeListId: UUID!, $animeId: UUID!) {
    createUserAnimeList(
      input: { userAnimeList: { animeListId: $animeListId, animeId: $animeId } }
    ) {
      animeList {
        id
      }
    }
  }
`;

const GET_USER_ANIME_LISTS = `
  query AnimeListQuery($userId: String!) {
    animeLists(condition: { userId: $userId }) {
      nodes {
        title
        id
      }
    }
  }
`;

const REMOVE_ANIME_TO_USER = `
  mutation RemoveAnimeToUser($animeId: UUID!, $userId: String!) {
  deleteUserAnime(input: {animeId: $animeId, userId: $userId}) {
    userAnime {
      animeId
      userId
    }
  }
}
`;

const AnimeCard = ({ title, url, score, id, likes }) => {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [notification, setNotification] = useState("none");
  const [AddResult, addAnimeToUser] = useMutation(ADD_ANIME_TO_USER);
  const [RemoveResult, removeAnimeToUser] = useMutation(REMOVE_ANIME_TO_USER);
  const { user } = useAuth();
  const [UserListResult, getUserLists] = useQuery({
    query: GET_USER_ANIME_LISTS,
    variables: { userId: user?.uid },
    pause: true,
  });

  const redirectToAnime = (e) => {
    router.push(`/anime/${id}`);
  };

  const onClickAdd = (e, animeId) => {
    e.stopPropagation();
    try {
      const animeListId = userLists.filter((item) => {
        return item.title === "default";
      })[0].id;
      addAnimeToUser({ animeListId, animeId }).then(() => {
        setNotification("anime-added");
      });
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  const onClickRemove = (e, userId, animeId) => {
    e.stopPropagation();
    try {
      removeAnimeToUser({ userId, animeId }).then(() => {
        setNotification("anime-removed");
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (notification === "anime-added") {
      toast({
        title: "Anime Added!",
        description: `${title} successfully added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      setNotification("none");
    } else if (notification === "anime-removed") {
      toast({
        title: "Removed Anime!",
        description: `${title} removed from list.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      setNotification("none");
    }
  }, [AddResult, error, title, toast, RemoveResult, notification]);

  useEffect(() => {
    if (!UserListResult.fetching && UserListResult.data) {
      setUserLists(UserListResult.data.animeLists.nodes);
    }
  }, [UserListResult]);

  useEffect(() => {
    if (user?.uid) {
      getUserLists();
    }
  }, [user, getUserLists]);

  return (
    <>
      <Box
        cursor="pointer"
        overflow="hidden"
        d="flex"
        alignItems="center"
        flexDirection="column"
        position="relative"
        minH="346px"
        w="225px"
        flex="0 0 auto"
        onClick={redirectToAnime}
      >
        <Badge
          position="absolute"
          zIndex="100"
          right="5"
          top="5"
          variant="solid"
          colorScheme="green"
          opacity="1"
        >
          {score}
        </Badge>
        <Box width="full" height="80%" display="block">
          <LoadImage image_url={url} alt={title} />
          {likes ? (
            <PopupMenuButton
              position="absolute"
              icon={<BsX size="2rem" />}
              isRound
              bg="red.300"
              bottom="3%"
              right="3%"
              onClick={(e) => onClickRemove(e, id)}
              isLoading={AddResult.fetching}
              visibility={user ? "visible" : "hidden"}
            />
          ) : (
            <IconButton
              position="absolute"
              icon={<BsPlus size="2rem" />}
              isRound
              bg="teal"
              bottom="3%"
              right="3%"
              isLoading={RemoveResult.fetching}
              onClick={(e) => onClickAdd(e, id)}
              visibility={user ? "visible" : "hidden"}
            />
          )}
        </Box>
        <Heading
          height="20%"
          display="inline-block"
          width="calc(100%)"
          pt="3"
          size="xs"
          wordBreak="normal"
          textAlign="center"
          justifySelf="center"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {title}
        </Heading>
      </Box>
    </>
  );
};

export default AnimeCard;
