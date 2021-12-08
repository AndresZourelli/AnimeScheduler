import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Divider,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Skeleton,
  AspectRatio,
  Select,
  Text,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import {
  useUserCustomAnimeListQuery,
  useUpdateListIndexMutation,
  CustomAnimeList,
  WatchStatusTypes,
} from "@/graphql";
import NextImage from "next/image";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { reorder } from "@/utilities/helperFunctions";
import { Lexico } from "@/utilities/lexicoHelperFunctions";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import useAnimeList from "../Hooks/useAnimeList";

interface AnimeItemInterface extends CustomAnimeList {
  animeIndex?: string;
  index?: number;
  dragProvided?: any;
}

const CustomListRow = ({
  id,
  title,
  imageUrl,
  index,
  mediaType,
  userEpisodesWatched,
  numberOfEpisodes,
  watchStatus,
  userScore,
  averageWatcherRating,
  dragProvided,
  animeId,
}: AnimeItemInterface) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const {
    onChangeUserAnimeRating,
    onChangeAnimeWatchStatus,
    onClickUserEpisodeCount,
    userEpisodeCount,
    userAnimeWatchStatus,
    userAnimeRating,
    setUserEpisodeCount,
    setUserAnimeWatchStatus,
    setUserAnimeRating,
  } = useAnimeList({
    animeTitle: title,
    inputAnimeId: animeId,
  });
  const imagedLoading = () => {
    setImageLoaded(true);
  };
  useEffect(() => {
    if (watchStatus) {
      setUserAnimeWatchStatus(watchStatus);
    }
  }, [watchStatus, setUserAnimeWatchStatus]);

  useEffect(() => {
    if (userScore) {
      setUserAnimeRating(userScore);
    }
  }, [userScore, setUserAnimeRating]);

  useEffect(() => {
    if (userEpisodesWatched) {
      setUserEpisodeCount(userEpisodesWatched);
    }
  }, [userEpisodesWatched, setUserEpisodeCount]);
  return (
    <Tr
      key={id}
      ref={dragProvided.innerRef}
      {...dragProvided.dragHandleProps}
      {...dragProvided.draggableProps}
    >
      <Td>{index + 1}</Td>
      <Td w="150px">
        <Skeleton isLoaded={imageLoaded} maxW="50px">
          <AspectRatio ratio={2 / 3} maxW="50px">
            <NextImage
              layout="fill"
              src={imageUrl}
              onLoadingComplete={imagedLoading}
            />
          </AspectRatio>
        </Skeleton>
      </Td>
      <Td w="250px">{title}</Td>
      <Td w="250px">{mediaType}</Td>
      <Td w="250px">
        <Box d="flex" justifyContent="flex-start" alignItems="center">
          <Tooltip label="Decrease your episode count">
            <IconButton
              colorScheme="gray"
              aria-label="Decrease your episode count"
              icon={<AiOutlineMinus />}
              size="xs"
              name="episodeDecrease"
              onClick={(e) =>
                onClickUserEpisodeCount(e, numberOfEpisodes, animeId)
              }
            />
          </Tooltip>
          <Tooltip label="Number of episodes you have watched">
            <Text textAlign="center" fontSize="lg" px="2" w="50%">
              {`${userEpisodeCount}/${
                numberOfEpisodes ? numberOfEpisodes : "???"
              }`}
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
                onClickUserEpisodeCount(e, numberOfEpisodes, animeId)
              }
            />
          </Tooltip>
        </Box>
      </Td>
      <Td w="250px">
        <Select
          size="lg"
          variant="unstyled"
          textAlign="center"
          value={userAnimeWatchStatus}
          onChange={(e) => onChangeAnimeWatchStatus(e, animeId)}
        >
          <option value={WatchStatusTypes.NotWatched}>Not Watched</option>
          <option value={WatchStatusTypes.PlanToWatch}>Plan to Watch</option>
          <option value={WatchStatusTypes.Watching}>Watching</option>
          <option value={WatchStatusTypes.Paused}>Paused</option>
          <option value={WatchStatusTypes.Completed}>Completed</option>
          <option value={WatchStatusTypes.Dropped}>Dropped</option>
          <option value={WatchStatusTypes.Rewatching}>Rewatching</option>
        </Select>
      </Td>
      <Td w="250px">
        <Select
          size="lg"
          variant="unstyled"
          w="full"
          textAlign="center"
          value={userAnimeRating}
          onChange={(e) => onChangeUserAnimeRating(e, animeId)}
          disabled={
            watchStatus === WatchStatusTypes.NotWatched ||
            watchStatus === WatchStatusTypes.PlanToWatch
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
      </Td>
      <Td w="250px">{averageWatcherRating}</Td>
    </Tr>
  );
};

export default CustomListRow;
