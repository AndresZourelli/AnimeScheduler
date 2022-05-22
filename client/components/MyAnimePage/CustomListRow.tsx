import { CustomAnimeList, WatchStatusTypes } from "@/graphql";
import { Icon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  IconButton,
  Select,
  Skeleton,
  Td,
  Text,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdDragHandle } from "react-icons/md";
import useAnimeList from "../Hooks/useAnimeList";
import { Identifier, XYCoord } from "dnd-core";

interface AnimeItemInterface extends CustomAnimeList {
  animeIndex?: string;
  index?: number;
  moveListItem: (id: string, atIndex: number) => void;
  updatePosition: (id: string, atIndex: number) => void;
  animeList: any[];
  findCard: (id: string) => any;
}

interface DragItem {
  originalIndex: number;
  id: string;
  type: string;
  name: string;
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
  animeId,
  moveListItem,
  animeList,
  findCard,
  updatePosition,
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
  const originalIndex = findCard(animeId).index;
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      // "type" is required. It is used by the "accept" specification of drop targets.
      type: "UserAnimeListItem",
      // The collect function utilizes a "monitor" instance (see the Overview for what this is)
      // to pull important pieces of state from the DnD system.
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: () => ({ id: animeId, originalIndex, name: title }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveListItem(droppedId, originalIndex);
        } else {
          updatePosition(droppedId, originalIndex);
        }
      },
    }),
    [index, animeId, title]
  );

  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >(
    () => ({
      accept: "UserAnimeListItem",
      collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
      hover: (item: DragItem, monitor) => {
        if (item.id !== animeId) {
          const { index: overIndex } = findCard(animeId);
          moveListItem(item.id, overIndex);
        }
      },
    }),
    [index, ref, moveListItem]
  );

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
  drag(drop(ref));
  return (
    <Tr
      key={id}
      ref={ref}
      role="Handle"
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
      h="100px"
      maxH="100px"
    >
      <Td>
        <Box>
          <Icon as={MdDragHandle} boxSize="7" />
        </Box>
      </Td>
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
        <Box display="flex" justifyContent="flex-start" alignItems="center">
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
