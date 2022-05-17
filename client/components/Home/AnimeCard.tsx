import LoadImage from "@/components/Common/ImageLoader";
import PopupMenuButton from "@/components/Common/PopupMenuButton";
import useAnimeList from "@/components/Hooks/useAnimeList";
import {
  AiringStatusTypes,
  MediaTypes,
  Season,
  WatchStatusTypes,
} from "@/graphql";
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
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
import CountDownTag from "../Common/CountDownTag";

type GenreList = {
  genre: string;
  id: string;
};
interface Generes {
  nodes: GenreList[];
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
  airingTime?: string;
  countDown?: boolean;
  description?: string;
  genreList?: Generes;
  mediaType?: MediaTypes;
  season?: Season;
  seasonYear?: number;
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
  airingTime = null,
  countDown = false,
  description = null,
  genreList = null,
  mediaType = null,
  season = null,
  seasonYear = null,
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

    onChangeAnimeWatchStatus,
    onChangeUserAnimeRating,
    onClickUserEpisodeCount,
  } = useAnimeList({ inputAnimeId: id, animeTitle: title });

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
    <Popover
      placement="right-start"
      trigger="hover"
      matchWidth
      isLazy
      eventListeners={{ scroll: false, resize: false }}
    >
      <PopoverTrigger>
        <Box
          d="flex"
          alignItems="center"
          flexDirection="column"
          position="relative"
          maxW="225px"
          w="225px"
          justifyContent="flex-start"
          h="395px"
        >
          <Box
            position="relative"
            onClick={redirectToAnime}
            cursor="pointer"
            role="group"
            borderRadius="lg"
            overflow={"hidden"}
          >
            <LoadImage
              image_url={coverImage}
              alt={title}
              maxW="225px"
              w="225px"
              borderRadius="lg"
              overflow="hidden"
            />
            <Tag
              position="absolute"
              top="2"
              right="2"
              bg="cyan.700"
              color="cyan.50"
            >
              {averageWatcherRating}
            </Tag>
            {userLiked ? (
              <Tag
                zIndex="2"
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
            <Box>
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
                bg="rgba(0,0,0,0.85)"
                _groupHover={{ opacity: 1 }}
                zIndex="3"
              >
                <Box
                  d="flex"
                  w="full"
                  justifyContent="center"
                  alignContent="center"
                  pt="2"
                  hidden={!user.loggedIn}
                >
                  <Box
                    position="absolute"
                    top="0"
                    h="100px"
                    w="full"
                    bgGradient="linear(to-t, blackAlpha.50, blackAlpha.900)"
                  />
                  <Box d="flex" justifyContent="flex-start" alignItems="center">
                    <Tooltip label="Decrease your episode count">
                      <IconButton
                        colorScheme="teal"
                        aria-label="Decrease your episode count"
                        disabled={
                          userWatchStatus === WatchStatusTypes.NotWatched ||
                          userWatchStatus === WatchStatusTypes.PlanToWatch
                        }
                        icon={<AiOutlineMinus />}
                        size="xs"
                        name="episodeDecrease"
                        onClick={(e) =>
                          onClickUserEpisodeCount(e, numberOfEpisodes, id)
                        }
                      />
                    </Tooltip>
                    <Tooltip label="Number of episodes you have watched">
                      <Text
                        textAlign="center"
                        fontSize="small"
                        px="2"
                        zIndex="tooltip"
                      >
                        {`${userEpisodesCount}/${
                          numberOfEpisodes ? numberOfEpisodes : "???"
                        }`}{" "}
                        eps watched
                      </Text>
                    </Tooltip>

                    <Tooltip label="Increase your episode count">
                      <IconButton
                        colorScheme="teal"
                        aria-label="Increase your episode count"
                        icon={<AiOutlinePlus />}
                        size="xs"
                        name="episodeIncrease"
                        onClick={(e) =>
                          onClickUserEpisodeCount(e, numberOfEpisodes, id)
                        }
                        disabled={
                          userWatchStatus === WatchStatusTypes.NotWatched ||
                          userWatchStatus === WatchStatusTypes.PlanToWatch
                        }
                      />
                    </Tooltip>
                  </Box>
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
                    zIndex="4"
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
                          icon={
                            <Icon
                              as={AiFillHeart}
                              color="red.300"
                              boxSize="1.5rem"
                            />
                          }
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
                          icon={
                            <Icon
                              as={AiOutlineHeart}
                              color="red.100"
                              boxSize="1.5rem"
                            />
                          }
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
              </Box>
              {userLiked ? (
                <Tag
                  zIndex="2"
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
              {airingTime && (
                <Tag
                  zIndex="2"
                  position="absolute"
                  variant="solid"
                  background="teal.600"
                  mb={1}
                  mr={1}
                  top="2"
                  left="2"
                >
                  {airingTime}
                </Tag>
              )}
              {countDown && (
                <CountDownTag
                  zIndex="2"
                  position="absolute"
                  variant="solid"
                  background="red.600"
                  mb={1}
                  ml={1}
                  bottom="0"
                  left="0"
                  startDate={startBroadcastDatetime}
                />
              )}
            </Box>
          </Box>
          <Box w="full" pt="3" position="relative">
            <Text
              width="full"
              textAlign="center"
              justifySelf="center"
              noOfLines={2}
              fontWeight="semibold"
              fontSize="md"
            >
              {title}
            </Text>
          </Box>
          {airingStatusType === AiringStatusTypes.CurrentlyAiring && (
            <CountDownTag
              zIndex="2"
              position="absolute"
              variant="solid"
              background="red.400"
              mb={1}
              ml={1}
              top="2"
              left="2"
              w="120px"
              minW="120px"
              startDate={startBroadcastDatetime}
            />
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent
        h="338px"
        maxH="338px"
        w="inherit"
        eventListeners={false}
        display="flex"
      >
        <PopoverHeader>
          {user.loggedIn ? (
            <>
              <Box d="flex" w="full" justifyContent="space-between">
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
                      <option value={WatchStatusTypes.Watching}>
                        Watching
                      </option>
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
        </PopoverHeader>
        <PopoverBody maxH="212px" flexGrow="1">
          <Box>
            {getSeason(season) === "Unknown" ? (
              <Text>Season Unknown</Text>
            ) : (
              <Text>
                {getSeason(season)} {seasonYear}
              </Text>
            )}

            {mediaType === MediaTypes.Movie ? (
              <Text mb="2" fontSize={"xs"}>
                {getMediaTypeString(mediaType)}
              </Text>
            ) : (
              <Text mb="2" fontSize={"xs"}>
                {getMediaTypeString(mediaType)} - {numberOfEpisodes} episodes
              </Text>
            )}
          </Box>
          <Text fontSize="sm" noOfLines={7}>
            {description}
          </Text>
        </PopoverBody>
        <PopoverFooter overflow="hidden" minH="65px" h="65px" maxH="65px">
          <Flex gap={2} wrap="wrap">
            {genreList?.nodes.map((genre) => (
              <Tag key={genre.id}>{genre.genre}</Tag>
            ))}
          </Flex>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default AnimeCard;

const getSeason = (season: string) => {
  switch (season) {
    case Season.Fall:
      return "Fall";
    case Season.Spring:
      return "Spring";
    case Season.Winter:
      return "Winter";
    case Season.Summer:
      return "Summer";
    default:
      return "Unknown";
  }
};

const getMediaTypeString = (mediaType: MediaTypes) => {
  switch (mediaType) {
    case MediaTypes.Movie:
      return "Movie";
    case MediaTypes.Special:
      return "Special";
    case MediaTypes.Tv:
      return "Tv";
    default:
      break;
  }
  return mediaType;
};
