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
} from "@chakra-ui/react";
import {
  useUserCustomAnimeListQuery,
  WatchingStatusEnum,
  useUpdateListIndexMutation,
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

interface CustomListInterface {
  listId: string;
  listTitle: string;
}

interface AnimeItemInterface {
  id?: string;
  animeId?: any;
  imageUrl?: string;
  listName?: string;
  mediaType?: string;
  numberOfEpisodes?: number;
  title?: string;
  userEpisodesWatched?: number;
  userScore?: any;
  watchStatus?: WatchingStatusEnum;
  averageWatcherRating?: any;
  animeIndex?: string;
}

const CustomList = ({ listId, listTitle }: CustomListInterface) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [animeItems, setAnimeItems] = useState<AnimeItemInterface[]>([]);
  const [userCustomListResult, queryUserCustomList] =
    useUserCustomAnimeListQuery({ variables: { listId: listId } });
  const [, mutationUpdateCustomListIndex] = useUpdateListIndexMutation();
  const imagedLoading = () => {
    setImageLoaded(true);
  };
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newItems: AnimeItemInterface[] = reorder(
      animeItems,
      result.source.index,
      result.destination.index
    );
    if (result.destination.index === 0) {
      newItems[result.destination.index].animeIndex = Lexico.positionBefore(
        animeItems[result.destination.index].animeIndex as string
      );
    } else if (result.destination.index === newItems.length - 1) {
      newItems[result.destination.index].animeIndex = Lexico.positionAfter(
        animeItems[result.destination.index].animeIndex as string
      );
    } else {
      if (result.source.index < result.destination.index) {
        newItems[result.destination.index].animeIndex = Lexico.positionBetween(
          animeItems[result.destination.index].animeIndex as string,
          animeItems[result.destination.index + 1].animeIndex as string
        );
      } else {
        newItems[result.destination.index].animeIndex = Lexico.positionBetween(
          animeItems[result.destination.index - 1].animeIndex as string,
          animeItems[result.destination.index].animeIndex as string
        );
      }
    }

    mutationUpdateCustomListIndex({
      animeId: animeItems[result.source.index].animeId,
      animeListId: listId,
      animeIndex: newItems[result.destination.index].animeIndex,
    });
    setAnimeItems(newItems);
  };
  useEffect(() => {
    if (!userCustomListResult.fetching && userCustomListResult.data) {
      let tempList: AnimeItemInterface[] = [
        ...userCustomListResult.data.userCustomAnimeList.nodes,
      ];
      tempList.sort((a, b) =>
        Lexico.comparePositions(a.animeIndex, b.animeIndex)
      );
      setAnimeItems(tempList);
    }
  }, [userCustomListResult.fetching, userCustomListResult.data]);
  return (
    <Box>
      <Box h="15vh">
        <Heading>{listTitle}</Heading>
      </Box>
      <Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Table>
            <Thead>
              <Tr>
                <Th />
                <Th />
                <Th>Title</Th>
                <Th>Media</Th>
                <Th>Episodes Watched</Th>
                <Th>Watch Status</Th>
                <Th>User Score</Th>
                <Th>Average Rating</Th>
              </Tr>
            </Thead>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <>
                  <Tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {animeItems.map((anime, index) => (
                      <Draggable
                        key={anime.id}
                        draggableId={anime.id}
                        index={index}
                      >
                        {(drag_provided, drag_snapshot) => (
                          <Tr
                            key={anime.id}
                            ref={drag_provided.innerRef}
                            {...drag_provided.dragHandleProps}
                            {...drag_provided.draggableProps}
                          >
                            <Td>{index + 1}</Td>
                            <Td w="150px">
                              <Skeleton isLoaded={imageLoaded} maxW="50px">
                                <AspectRatio ratio={2 / 3} maxW="50px">
                                  <NextImage
                                    layout="fill"
                                    src={anime.imageUrl}
                                    onLoadingComplete={imagedLoading}
                                  />
                                </AspectRatio>
                              </Skeleton>
                            </Td>
                            <Td w="250px">{anime.title}</Td>
                            <Td w="250px">{anime.mediaType}</Td>
                            <Td w="250px">
                              {anime.userEpisodesWatched}/
                              {anime.numberOfEpisodes ?? "???"}
                            </Td>
                            <Td w="250px">{anime.watchStatus}</Td>
                            <Td w="250px">{anime.userScore}</Td>
                            <Td w="250px">{anime.averageWatcherRating}</Td>
                          </Tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Tbody>
                </>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </Box>
    </Box>
  );
};

export default CustomList;
