import LoadImage from "@/components/Common/ImageLoader";
import PopupMenuButton from "@/components/Common/PopupMenuButton";
import useAnimeList from "@/components/Hooks/useAnimeList";
import { AiringStatusTypes, WatchStatusTypes } from "@/graphql";
import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Select,
  Tag,
  TagLeftIcon,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import useCountDown from "../Hooks/useCountDown";
interface IAnime {
  id: any;
  title: string;
  coverImage?: string;
  numberOfEpisodes?: number;
  averageWatcherRating?: any;
  userLiked?: boolean;
  userRating?: any;
  userWatchStatus?: WatchStatusTypes;
  userEpisodeCount?: any;
  startBroadcastDatetime?: any;
  airingStatusType?: AiringStatusTypes;
}
interface AnimeCard {
  id?: any;
  title?: string;
  coverImage?: string;
  numberOfEpisodes?: number;
  averageWatcherRating?: any;
  userLiked?: boolean;
  userRating?: any;
  userWatchStatus?: string;
  userEpisodeCount?: any;
  startBroadcastDatetime?: any;
  airingStatusType?: string;
  animeInfo?: any;
  showNextEpisode?: boolean;
}

const AnimeCard = ({
  title = null,
  coverImage = null,
  id,
  averageWatcherRating = null,
  userLiked = null,
  numberOfEpisodes = null,
  userWatchStatus = null,
  startBroadcastDatetime = null,
  airingStatusType = null,
  userRating = null,
  userEpisodeCount = null,
  showNextEpisode = false,
}: AnimeCard) => {
  const router = useRouter();

  const [userEpisodesCount, setUserEpisodeCount] = useState<number>(0);
  const [userAnimeWatchStatus, setUserAnimeWatchStatus] =
    useState<WatchStatusTypes>(WatchStatusTypes.NotWatched);
  const [userAnimeRating, setUserAnimeRating] = useState(-1);

  const {
    addAnimeResult,
    removeAnimeResult,
    addAnimeToList,
    removeAnimeFromList,
    user,
    userAnimeLists,
    AddToNewList,
    AddToExistingList,
    updateWatchStatus,
    updateAnimeScore,
    updateEpisodeCount,
    onChangeAnimeWatchStatus,
    onChangeUserAnimeRating,
    onClickUserEpisodeCount,
  } = useAnimeList({ inputAnimeId: id, animeTitle: title });
  const { days, hours, minutes } = useCountDown({
    endInputDate: startBroadcastDatetime,
  });

  const redirectToAnime = (e) => {
    router.push(`/animes/${id}`);
  };

  const addAnimeToDefaultList = (
    e: React.MouseEvent<HTMLButtonElement>,
    animeId: string
  ) => {
    e.stopPropagation();
    addAnimeToList(e, animeId);
  };
  const removeAnimeFromDefaultList = (
    e: React.MouseEvent<HTMLButtonElement>,
    animeId: string
  ) => {
    e.stopPropagation();
    removeAnimeFromList(e, animeId);
  };

  useEffect(() => {
    if (userWatchStatus) {
      setUserAnimeWatchStatus(userWatchStatus as WatchStatusTypes);
    }
  }, [userWatchStatus]);

  useEffect(() => {
    if (userAnimeRating) {
      setUserAnimeRating(userAnimeRating);
    }
  }, [userAnimeRating]);

  useEffect(() => {
    if (userRating) {
      setUserAnimeRating(userRating);
    }
  }, [userRating]);

  useEffect(() => {
    if (userEpisodeCount) {
      setUserEpisodeCount(userEpisodeCount);
    }
  }, [userEpisodeCount]);

  useEffect(() => {
    if (userEpisodesCount) {
      setUserEpisodeCount(userEpisodesCount);
    }
  }, [userEpisodesCount]);
  return (
    <>
      <Box
        d="flex"
        alignItems="center"
        flexDirection="column"
        position="relative"
        maxW="225px"
      >
        {user ? (
          <>
            {(airingStatusType as AiringStatusTypes) ===
              AiringStatusTypes.CurrentlyAiring && showNextEpisode ? (
              <Box
                w="full"
                bg="gray.600"
                fontSize="md"
                textAlign="center"
              >{`Next ep in ${days}d ${hours}h ${minutes}m`}</Box>
            ) : null}
            <Box d="flex" bg="gray.600" w="full" justifyContent="space-between">
              <Box>
                <Tooltip label="Choose your watch status">
                  <Select
                    size="sm"
                    variant="unstyled"
                    textAlign="center"
                    onChange={(e) => onChangeAnimeWatchStatus(e, id)}
                    value={userAnimeWatchStatus}
                  >
                    <option value={WatchStatusTypes.NotWatched}>
                      Not Watched
                    </option>
                    <option value={WatchStatusTypes.PlanToWatch}>
                      Plan to Watch
                    </option>
                    <option value={WatchStatusTypes.Watching}>Watching</option>
                    <option value={WatchStatusTypes.Paused}>Paused</option>
                    <option value={WatchStatusTypes.Completed}>
                      Completed
                    </option>
                    <option value={WatchStatusTypes.Dropped}>Dropped</option>
                    <option value={WatchStatusTypes.Rewatching}>
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
                    onChange={(e) => onChangeUserAnimeRating(e, id)}
                    value={userAnimeRating}
                    visibility={
                      userAnimeWatchStatus === WatchStatusTypes.NotWatched ||
                      userAnimeWatchStatus === WatchStatusTypes.PlanToWatch
                        ? "hidden"
                        : "visible"
                    }
                  >
                    <option value={-1}>Rate me</option>
                    <option value={0}>0/10</option>
                    <option value={1}>1/10</option>
                    <option value={2}>2/10</option>
                    <option value={3}>3/10</option>
                    <option value={4}>4/10</option>
                    <option value={5}>5/10</option>
                    <option value={6}>6/10</option>
                    <option value={7}>7/10</option>
                    <option value={8}>8/10</option>
                    <option value={9}>9/10</option>
                    <option value={10}>10/10</option>
                  </Select>
                </Tooltip>
              </Box>
            </Box>
          </>
        ) : null}

        <Box
          width="full"
          position="relative"
          w="225px"
          overflow="hidden"
          onClick={redirectToAnime}
          cursor="pointer"
          role="group"
        >
          <LoadImage image_url={coverImage} alt={title} maxW="225px" />

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
            bg="rgba(0,0,0,0.7)"
            _groupHover={{ opacity: 1 }}
            zIndex="100"
          >
            <Box
              d="flex"
              w="full"
              justifyContent="center"
              alignContent="center"
              pt="2"
            >
              <Box d="flex" justifyContent="flex-start" alignItems="center">
                <Tooltip label="Decrease your episode count">
                  <IconButton
                    colorScheme="gray"
                    aria-label="Decrease your episode count"
                    icon={<AiOutlineMinus />}
                    size="xs"
                    name="episodeDecrease"
                    onClick={(e) =>
                      onClickUserEpisodeCount(e, numberOfEpisodes, id)
                    }
                  />
                </Tooltip>
                <Tooltip label="Number of episodes you have watched">
                  <Text textAlign="center" fontSize="small" px="2">
                    {`${userEpisodesCount}/${
                      numberOfEpisodes ? numberOfEpisodes : "???"
                    }`}{" "}
                    eps watched
                  </Text>
                </Tooltip>

                <Tooltip label="Increase your episode count">
                  <IconButton
                    colorScheme="gray"
                    aria-label="Increase your episode count"
                    icon={<AiOutlinePlus />}
                    size="xs"
                    name="episodeIncrease"
                    onClick={(e) =>
                      onClickUserEpisodeCount(e, numberOfEpisodes, id)
                    }
                  />
                </Tooltip>
              </Box>
            </Box>
          </Box>
          {userLiked ? (
            <Tag
              zIndex="75"
              position="absolute"
              variant="solid"
              mb={1}
              mr={1}
              bottom="0"
              right="0"
            >
              <TagLeftIcon as={AiFillHeart} mr="0" color={"red.300"} />
            </Tag>
          ) : null}
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

            {userLiked ? (
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
                  visibility={user ? "visible" : "hidden"}
                />
              </Tooltip>
            )}
          </Flex>
        </Box>
        <Box d="flex" w="full" pt="3">
          <Badge>{averageWatcherRating}</Badge>
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
