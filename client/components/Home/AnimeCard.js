import { Box, Heading, Badge, IconButton, useToast } from "@chakra-ui/react";
import LoadImage from "@/components/Common/ImageLoader";
import { BsPlus, BsX } from "react-icons/bs";
import { useMutation } from "urql";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { useRouter } from "next/router";

const ADD_ANIME_TO_USER = `
  mutation AddAnimeToUser($animeId: UUID!, $userId: String!) {
  createUserAnime(input: {userAnime: {animeId: $animeId, userId: $userId}}) {
    userAnime {
      animeId
      userId
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
  const [notification, setNotification] = useState("none");
  const [AddResult, addAnimeToUser] = useMutation(ADD_ANIME_TO_USER);
  const [RemoveResult, removeAnimeToUser] = useMutation(REMOVE_ANIME_TO_USER);
  const { user } = useAuth();

  const redirectToAnime = (e) => {
    router.push(`/anime/${id}`);
  };

  const onClickAdd = (e, userId, animeId) => {
    e.stopPropagation();
    try {
      addAnimeToUser({ userId, animeId }).then(() => {
        setNotification("anime-added");
      });
    } catch (e) {
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

  return (
    <>
      <Box
        cursor="pointer"
        overflow="hidden"
        d="flex"
        alignItems="center"
        flexDirection="column"
        position="relative"
        height="100%"
        minH="350px"
        w="200px"
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
        <Box width="100%" height="80%" position="relative" display="block">
          <LoadImage image_url={url} alt={title} />
          {likes ? (
            <IconButton
              position="absolute"
              icon={<BsX size="2rem" />}
              isRound
              bg="red.300"
              bottom="3%"
              right="3%"
              onClick={(e) => onClickRemove(e, user.uid, id)}
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
              onClick={(e) => onClickAdd(e, user.uid, id)}
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
