import LoadImage from "@/components/Common/ImageLoader";
import PopupMenuButton from "@/components/Common/PopupMenuButton";
import useAnimeList from "@/components/Hooks/useAnimeList";
import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Select,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlinePlus,
  AiOutlineMinus,
} from "react-icons/ai";
import { WatchingStatusEnum } from "@/graphql";

interface AnimeCard {
  title?: string;
  url: string;
  score?: number;
  id: string;
  likes?: boolean;
  userSection?: any;
}

const AnimeCard = ({
  title = null,
  url = null,
  id,
  score = null,
  likes = null,
  userSection = null,
}: AnimeCard) => {
  const router = useRouter();
  const [userEpisodeCount, setUserEpisodeCount] = useState(0);
  const [userAnimeWatchStatus, setUserAnimeWatchStatus] = useState(
    WatchingStatusEnum.NotWatching
  );
  const [userAnimeRating, setUserAnimeRating] = useState(0);

  const {
    addAnimeResult,
    removeAnimeResult,
    addAnimeToList,
    removeAnimeFromList,
    user,
    error,
    userAnimeLists,
    AddToNewList,
    AddToExistingList,
  } = useAnimeList({ inputAnimeId: id, animeTitle: title });

  const redirectToAnime = (e) => {
    router.push(`/anime/${id}`);
  };

  const addAnimeToDefaultList = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    animeId: string
  ) => {
    e.stopPropagation();
    addAnimeToList(e, animeId);
  };
  const removeAnimeFromDefaultList = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    animeId: string
  ) => {
    e.stopPropagation();
    removeAnimeFromList(e, animeId);
  };

  return (
    <>
      <Box
        d="flex"
        alignItems="center"
        flexDirection="column"
        position="relative"
        maxW="225px"
        role="group"
      >
        {user ? (
          <>
            <Box d="flex" bg="gray.600" w="full" justifyContent="space-between">
              <Box>
                <Tooltip label="Choose your watch status">
                  <Select size="sm" variant="unstyled" textAlign="center">
                    <option value={WatchingStatusEnum.NotWatching}>
                      Not Watched
                    </option>
                    <option value={WatchingStatusEnum.PlanToWatch}>
                      Plan to Watch
                    </option>
                    <option value={WatchingStatusEnum.Paused}>Paused</option>
                    <option value={WatchingStatusEnum.Completed}>
                      Completed
                    </option>
                    <option value={WatchingStatusEnum.Dropped}>Dropped</option>
                    <option value={WatchingStatusEnum.Rewatching}>
                      Rewatching
                    </option>
                  </Select>
                </Tooltip>
              </Box>
              <Box>
                <Tooltip label="Your rating of this Anime">
                  <Select
                    size="sm"
                    variant="unstyled"
                    w="full"
                    textAlign="center"
                  >
                    <option>Rate me</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                  </Select>
                </Tooltip>
              </Box>
            </Box>
            <Box
              d="flex"
              bg="gray.600"
              w="full"
              justifyContent="center"
              alignContent="center"
              pb="1"
            >
              <Box
                d="flex"
                justifyContent="flex-start"
                w="50%"
                alignItems="center"
              >
                <Tooltip label="Increase your episode count">
                  <IconButton
                    colorScheme="gray"
                    aria-label="Increase your episode count"
                    icon={<AiOutlinePlus />}
                    size="xs"
                  />
                </Tooltip>
                <Tooltip label="Number of episodes you have watched">
                  <Text textAlign="center" fontSize="small" w="50%">
                    {`${0}/10`} eps
                  </Text>
                </Tooltip>
                <Tooltip label="Decrease your episode count">
                  <IconButton
                    colorScheme="gray"
                    aria-label="Decrease your episode count"
                    icon={<AiOutlineMinus />}
                    size="xs"
                  />
                </Tooltip>
              </Box>
            </Box>
          </>
        ) : null}

        <Box
          width="full"
          position="relative"
          minH="346px"
          w="225px"
          overflow="hidden"
          onClick={redirectToAnime}
          cursor="pointer"
        >
          <Box
            position="absolute"
            top="0"
            bottom="0"
            left="0"
            right="0"
            h="full"
            w="full"
            opacity="0"
            transition="all .3s ease-in-out"
            bg="rgba(0,0,0,0.5)"
            _groupHover={{ opacity: 1 }}
            zIndex="100"
          />
          <LoadImage image_url={url} alt={title} />
          <Flex
            position="absolute"
            right="3%"
            bottom="3%"
            flexDirection={"column"}
            justifyContent="center"
            alignContent="center"
            w="auto"
            opacity="0"
            _groupHover={{ opacity: 1 }}
            transition="all .3s ease-in-out"
            zIndex="200"
          >
            <PopupMenuButton
              customList={userAnimeLists}
              animeId={id}
              addToNewList={AddToNewList}
              addToExistingList={AddToExistingList}
            />

            {likes || userSection ? (
              <Tooltip label="Remove anime from list">
                <IconButton
                  aria-label="Remove anime from list button"
                  icon={<AiFillHeart color="red.300" size="1.4rem" />}
                  isRound
                  bg="teal"
                  onClick={(e) => removeAnimeFromDefaultList(e, id)}
                  isLoading={addAnimeResult.fetching}
                  visibility={user ? "visible" : "hidden"}
                />
              </Tooltip>
            ) : (
              <Tooltip label="Add anime to list">
                <IconButton
                  aria-label="Add anime from list button"
                  icon={<AiOutlineHeart size="1.4rem" />}
                  isRound
                  bg="teal"
                  isLoading={removeAnimeResult.fetching}
                  onClick={(e) => addAnimeToDefaultList(e, id)}
                  // onClick={togglePopover}
                  visibility={user ? "visible" : "hidden"}
                />
              </Tooltip>
            )}
          </Flex>
        </Box>
        <Box d="flex" w="full" pt="3">
          <Badge>{score}</Badge>
          <Heading
            display="inline-block"
            width="calc(100%)"
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
      </Box>
    </>
  );
};

export default AnimeCard;
