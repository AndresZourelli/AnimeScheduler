import { Box, Heading, Badge, IconButton, useToast } from "@chakra-ui/react";
import Link from "next/link";
import LoadImage from "@/components/Common/ImageLoader";
import { BsPlus } from "react-icons/bs";
import { useMutation, gql } from "@apollo/client";
import { useEffect } from "react";
import { useAuth } from "@/lib/authClient";

const ADD_ANIME_TO_USER = gql`
  mutation AddToAnime($animeId: ID!) {
    addAnimeToUser(animeId: $animeId) {
      success
      errors {
        message
      }
    }
  }
`;

const AnimeCard = ({ title, url, score, id }) => {
  console.log(title, id);
  const toast = useToast();
  const [addAnime, { data, loading, error }] = useMutation(ADD_ANIME_TO_USER, {
    variables: { animeId: id },
  });
  const { user } = useAuth();

  const callAddAnime = (e) => {
    e.preventDefault();
    addAnime();
  };

  useEffect(() => {
    if (data?.addAnimeToUser?.success) {
      toast({
        title: "Anime Added!",
        description: `${title} successfully added.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } else if (data?.addAnimeToUser?.success == false) {
      toast({
        title: "Anime Already Added!",
        description: `${title} already added to list.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } else if (error) {
      toast({
        title: "Account created.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }, [data, error]);

  return (
    <Link href={`/anime/${id}`}>
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
          <IconButton
            position="absolute"
            icon={<BsPlus size="2rem" />}
            isRound
            bg="teal"
            bottom="3%"
            right="3%"
            isLoading={loading}
            onClick={callAddAnime}
            visibility={user?.isAuthenticated ? "visible" : "hidden"}
          />
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
    </Link>
  );
};

export default AnimeCard;
