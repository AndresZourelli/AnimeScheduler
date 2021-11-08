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
  Tag,
  TagLeftIcon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlinePlus,
  AiOutlineMinus,
} from "react-icons/ai";
import { WatchingStatusEnum, AllAnimesTile } from "@/graphql";
import useCountDown from "../Hooks/useCountDown";

interface AnimeCard {
  title?: string;
  url: string;
  score?: number;
  id: string;
  likes?: boolean;
  userSection?: any;
  numOfEpisodes?: number | null;
  animeInfo?: AllAnimesTile;
}

const AnimeCard = ({
  title = null,
  url = null,
  id,
  score = null,
  likes = null,
  userSection = null,
  numOfEpisodes = null,
  animeInfo = null,
}: AnimeCard) => {
  const router = useRouter();

  const [userEpisodeCount, setUserEpisodeCount] = useState<number>(0);
  const [userAnimeWatchStatus, setUserAnimeWatchStatus] = useState(
    WatchingStatusEnum.NotWatching
  );
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
  } = useAnimeList({ inputAnimeId: id, animeTitle: title });
  const { days, hours, minutes } = useCountDown({
    endInputDate: animeInfo?.startBroadcastDatetime,
  });
  const onClickUserEpisodeCount = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.currentTarget.value != userAnimeWatchStatus) {
      setUserAnimeWatchStatus(event.currentTarget.value as WatchingStatusEnum);
      updateWatchStatus(id, event.currentTarget.value as WatchingStatusEnum);
    }
  };

  const onChangeUserAnimeRating = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const rawUserScore = Number(event.currentTarget.value);
    if (rawUserScore != userAnimeRating) {
      setUserAnimeRating(rawUserScore);
      updateAnimeScore(id, rawUserScore);
    }
  };

  const redirectToAnime = (e) => {
    router.push(`/anime/${id}`);
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
    if (animeInfo && animeInfo.userWatchStatus) {
      setUserAnimeWatchStatus(animeInfo.userWatchStatus);
    }
  }, [animeInfo]);

  useEffect(() => {
    if (animeInfo && animeInfo.userRating) {
      setUserAnimeRating(animeInfo.userRating);
    }
  }, [animeInfo]);

  useEffect(() => {
    if (animeInfo && animeInfo.userEpisodeCount) {
      setUserEpisodeCount(animeInfo.userEpisodeCount);
    }
  }, [animeInfo]);
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
            {animeInfo?.airingStatusType === "Currently Airing" ? (
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
                    onChange={onChangeAnimeWatchStatus}
                    value={userAnimeWatchStatus}
                  >
                    <option value={WatchingStatusEnum.NotWatching}>
                      Not Watched
                    </option>
                    <option value={WatchingStatusEnum.PlanToWatch}>
                      Plan to Watch
                    </option>
                    <option value={WatchingStatusEnum.Watching}>
                      Watching
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
                    onChange={onChangeUserAnimeRating}
                    value={userAnimeRating}
                    visibility={
                      userAnimeWatchStatus === WatchingStatusEnum.NotWatching ||
                      userAnimeWatchStatus === WatchingStatusEnum.PlanToWatch
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
          <LoadImage image_url={url} alt={title} maxW="225px" />

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
                    onClick={onClickUserEpisodeCount}
                  />
                </Tooltip>
                <Tooltip label="Number of episodes you have watched">
                  <Text textAlign="center" fontSize="small" px="2">
                    {`${userEpisodeCount}/${
                      numOfEpisodes ? numOfEpisodes : "???"
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
                    onClick={onClickUserEpisodeCount}
                  />
                </Tooltip>
              </Box>
            </Box>
          </Box>
          {likes ? (
            <Tag
              zIndex="75"
              position="absolute"
              variant="solid"
              mb={1}
              mr={1}
              bottom="0"
              right="0"
            >
              <TagLeftIcon
                as={AiFillHeart}
                mr="0"
                color={"red.300"}
              ></TagLeftIcon>
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

            {animeInfo?.userLiked || userSection ? (
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
