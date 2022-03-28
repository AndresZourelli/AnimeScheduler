import { ExistingItem } from "@/components/AddNewAnime/SelectItemForm/ItemSearchBar";
import { useGetRelatedMediaQuery } from "@/graphql";
import { useEffect, useState } from "react";
import DisplayItems from "./DisplayItems";

const SelectedRelatedMediaTab = ({
  newListName = null,
  existingListName = null,
  placeholder,
  newItemComponent = null,
  addItemTitle,
}) => {
  const [modifiedResult, setModifiedResult] = useState<ExistingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryResult, callQuery] = useGetRelatedMediaQuery({
    variables: { like: `%${searchQuery}%` },
    pause: true,
  });

  useEffect(() => {
    let newList: ExistingItem[] = [];
    if (!queryResult.fetching && queryResult.data) {
      newList = queryResult.data.animes.nodes.map((anime) => {
        return {
          itemId: anime.id,
          name: anime.title,
          imageUrl: anime.coverImage,
        };
      });
      setModifiedResult(newList);
    }
  }, [queryResult]);

  useEffect(() => {
    if (searchQuery !== "") {
      callQuery();
    } else {
      setModifiedResult([]);
    }
  }, [searchQuery, callQuery]);

  return (
    <>
      <DisplayItems
        addItemTitle={addItemTitle}
        placeholder={placeholder}
        queryResult={modifiedResult}
        setSearchQuery={setSearchQuery}
        existingListName={existingListName}
        newItemComponent={newItemComponent}
        newListName={newListName}
      />
    </>
  );
};

export default SelectedRelatedMediaTab;
