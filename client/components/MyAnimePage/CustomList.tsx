import {
  CustomAnimeList,
  useUpdateListIndexMutation,
  useUserCustomAnimeListQuery,
  useDeleteUserAnimeListMutation,
  useUpdateUserAnimeListTitleMutation,
} from "@/graphql";
import { reorder } from "@/utilities/helperFunctions";
import { Lexico } from "@/utilities/lexicoHelperFunctions";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Button,
  Flex,
  useToast,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import CustomListRow from "./CustomListRow";
import { FiEdit, FiXSquare, FiSave } from "react-icons/fi";

interface CustomListInterface {
  listId: string;
  listTitle: string;
}

const CustomList = ({ listId, listTitle }: CustomListInterface) => {
  const [animeItems, setAnimeItems] = useState<CustomAnimeList[]>([]);
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [editTitleValue, setEditTitleValue] = useState<string>();
  const [editNewTitleValue, setEditNewTitleValue] = useState<string>();
  const [userCustomListResult, queryUserCustomList] =
    useUserCustomAnimeListQuery({ variables: { listId: listId } });
  const [, mutationUpdateCustomListIndex] = useUpdateListIndexMutation();
  const [, mutationDeleteUserList] = useDeleteUserAnimeListMutation();
  const [, mutationUpdateUserListTitle] = useUpdateUserAnimeListTitleMutation();
  const toast = useToast();
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newItems: CustomAnimeList[] = reorder(
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

  const deleteUserList = async () => {
    try {
      const { error } = await mutationDeleteUserList({ listId: listId });
      if (error) {
        throw new Error(error.message);
      }
      toast({
        title: `${listTitle} deleted.`,
        description: `List successfully deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      toast({
        title: `Unable to delete ${listTitle}`,
        description: `Could not delete list.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditNewTitleValue(e.target.value);
  };

  const onClickCloseTitle = () => {
    setEditTitle(!editTitle);
    setEditNewTitleValue(listTitle);
  };

  const onClickEditTitle = () => {
    setEditTitle(!editTitle);
  };

  const onClickSaveTitle = async () => {
    try {
      const { error } = await mutationUpdateUserListTitle({
        listId: listId,
        title: editNewTitleValue,
      });
      if (error) {
        throw new Error();
      }
      setEditTitle(!editTitle);
      setEditTitleValue(editNewTitleValue);
      toast({
        title: `Title changed successfully.`,
        description: `List renamed to ${editNewTitleValue}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      toast({
        title: `Unable to change list title.`,
        description: `Could not edit list.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    if (!userCustomListResult.fetching && userCustomListResult.data) {
      let tempList: CustomAnimeList[] = [
        ...userCustomListResult.data.userCustomAnimeList.nodes,
      ];
      tempList.sort((a, b) =>
        Lexico.comparePositions(a.animeIndex, b.animeIndex)
      );
      setAnimeItems(tempList);
    }
  }, [userCustomListResult.fetching, userCustomListResult.data]);

  useEffect(() => {
    if (listTitle) {
      setEditTitleValue(listTitle);
      setEditNewTitleValue(listTitle);
    }
  }, [listTitle]);

  useEffect(() => {
    if (listTitle === "default") {
      setIsDefault(true);
    }
  }, [listTitle]);

  return (
    <Box>
      <Flex h="15vh" justifyContent="space-between">
        <Flex alignItems="center">
          {editTitle ? (
            <Input mr="3" value={editNewTitleValue} onChange={onChangeTitle} />
          ) : (
            <Heading mr="3">{editTitleValue}</Heading>
          )}
          {editTitle ? (
            <>
              <IconButton
                aria-label="Save new list name"
                icon={<FiSave />}
                size="sm"
                onClick={onClickSaveTitle}
                mr="3"
              />
              <IconButton
                aria-label="Cancel edit list name"
                icon={<FiXSquare />}
                size="sm"
                onClick={onClickCloseTitle}
              />
            </>
          ) : isDefault ? null : (
            <IconButton
              aria-label="Edit list name"
              icon={<FiEdit />}
              size="sm"
              onClick={onClickEditTitle}
            />
          )}
        </Flex>
        {isDefault ? null : (
          <Button onClick={deleteUserList} colorScheme="blue">
            Delete List
          </Button>
        )}
      </Flex>
      <Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Table>
            <Thead>
              <Tr>
                <Th />
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
                          <CustomListRow
                            dragProvided={drag_provided}
                            {...anime}
                            index={index}
                            dragSnapshot={drag_snapshot}
                          />
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
