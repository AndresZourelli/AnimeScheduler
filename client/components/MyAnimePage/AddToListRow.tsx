import { useAddAnimeToListMutation, WatchingStatusEnum } from "@/graphql";
import { Button, Select, Td, Tr, useToast } from "@chakra-ui/react";
import { useState } from "react";

const AddToListRow = ({
  animeTitle,
  listTitle,
  animeId,
  listId,
  userAnimeList,
}) => {
  const [selectValue, setSelectValue] = useState(WatchingStatusEnum.Watching);
  const [addToAnimeListResult, runAddToAnimeList] = useAddAnimeToListMutation();
  const toast = useToast();
  const addAnimeToListCall = async (userListId: string) => {
    const result = await runAddToAnimeList({
      animeId,
      animeListId: userListId,
      watchingStatus: selectValue,
    });
    if (result.data.upsertUserAnimeList) {
      toast({
        title: "Anime added to list!",
        description: `"${animeTitle}" added to "${listTitle}".`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (result.error) {
      toast({
        title: "Could not add anime to list!",
        description: `"${animeTitle}" could not be added to "${listTitle}".`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const onSelectChange = (e) => {
    setSelectValue(e.target.value);
  };

  return (
    <Tr>
      <Td>{listTitle}</Td>
      <Td display="flex" justifyContent="flex-end">
        <Select size="sm" w="70%" mr="2%" onChange={onSelectChange}>
          <option defaultValue={WatchingStatusEnum.Watching}>Watching</option>
          <option value={WatchingStatusEnum.PlanToWatch}>Plan to watch</option>
          <option value={WatchingStatusEnum.Paused}>Paused</option>
          <option value={WatchingStatusEnum.Completed}>Completed</option>
          <option value={WatchingStatusEnum.Dropped}>Dropped</option>
          <option value={WatchingStatusEnum.Rewatching}>Rewatching</option>
        </Select>
        <Button size="sm" onClick={() => addAnimeToListCall(listId)}>
          Add to List
        </Button>
      </Td>
    </Tr>
  );
};

export default AddToListRow;
