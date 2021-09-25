import LoadImage from "@/components/Common/ImageLoader";
import PopupMenuButton from "@/components/Common/PopupMenuButton";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { Badge, Box, Heading, IconButton, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPlus, BsX } from "react-icons/bs";
import { useMutation, useQuery } from "urql";
import useAnimeList from "@/components/Hooks/useAnimeList";

const AnimeCard = ({ title, url, score, id, likes }) => {
  const router = useRouter();
  const toast = useToast();

  const [notification, setNotification] = useState("none");

  const {
    addAnimeResult,
    removeAnimeResult,
    addAnimeToList,
    removeAnimeFromList,
    user,
    error,
    userAnimeLists,
  } = useAnimeList();

  const redirectToAnime = (e) => {
    router.push(`/anime/${id}`);
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
  }, [addAnimeResult, error, title, toast, removeAnimeResult, notification]);
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
        borderRadius="lg"
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
              onClickInner={(e) => removeAnimeFromList(e, id)}
              isLoading={addAnimeResult.fetching}
              visibility={user ? "visible" : "hidden"}
            />
          ) : (
            <IconButton
              aria-label="Remove anime from list button"
              position="absolute"
              icon={<BsPlus size="2rem" />}
              isRound
              bg="teal"
              bottom="3%"
              right="3%"
              isLoading={removeAnimeResult.fetching}
              onClick={(e) => addAnimeToList(e, id)}
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
