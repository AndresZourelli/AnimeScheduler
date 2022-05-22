import {
  CustomAnimeList,
  useDeleteUserAnimeListMutation,
  useUpdateListIndexMutation,
  useUpdateUserAnimeListTitleMutation,
  useUserCustomAnimeListQuery,
} from "@/graphql";
// import { reorder } from "@/utilities/helperFunctions";
import { Lexico } from "@/utilities/lexicoHelperFunctions";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiEdit, FiSave, FiXSquare } from "react-icons/fi";
import CustomListRow from "./CustomListRow";

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

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const moveListItem = (id: string, newIndex: number) => {
    const { card, index: prevIndex } = findCard(id);
    console.log("prev:", prevIndex, "new:", newIndex);
    const newItems: CustomAnimeList[] = reorder(
      animeItems,
      prevIndex,
      newIndex
    );
    if (newIndex === 0) {
      newItems[newIndex].animeIndex = Lexico.positionBefore(
        animeItems[newIndex].animeIndex as string
      );
    } else if (newIndex === newItems.length - 1) {
      newItems[newIndex].animeIndex = Lexico.positionAfter(
        animeItems[newIndex].animeIndex as string
      );
    } else {
      if (prevIndex < newIndex) {
        newItems[newIndex].animeIndex = Lexico.positionBetween(
          animeItems[newIndex].animeIndex as string,
          animeItems[newIndex + 1].animeIndex as string
        );
      } else {
        newItems[newIndex].animeIndex = Lexico.positionBetween(
          animeItems[newIndex - 1].animeIndex as string,
          animeItems[newIndex].animeIndex as string
        );
      }
    }

    setAnimeItems(newItems);
  };

  const updatePosition = (id: string, prevIndex: number) => {
    const { card, index: currentIndex } = findCard(id);

    mutationUpdateCustomListIndex({
      animeId: animeItems[currentIndex].animeId,
      animeListId: listId,
      animeIndex: animeItems[currentIndex].animeIndex,
    });
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

  const findCard = (id: string) => {
    const card = animeItems.filter((c) => `${c.animeId}` === id)[0];
    return {
      card,
      index: animeItems.indexOf(card),
    };
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

          <Tbody>
            {animeItems.map((anime, index) => (
              <CustomListRow
                key={anime.animeId + "-" + anime.id}
                {...anime}
                index={index}
                moveListItem={moveListItem}
                animeList={animeItems}
                findCard={findCard}
                updatePosition={updatePosition}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default CustomList;
