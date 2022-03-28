import { ExistingItem } from "@/components/AddNewAnime/SelectItemForm/ItemSearchBar";
import { useGetCharactersQuery } from "@/graphql";
import { useEffect, useState } from "react";
import DisplayItems from "./DisplayItems";

const SelectedCharactersTab = ({
  newListName = null,
  existingListName = null,
  placeholder,
  newItemComponent = null,
  addItemTitle,
}) => {
  const [modifiedResult, setModifiedResult] = useState<ExistingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryResult, callQuery] = useGetCharactersQuery({
    variables: { like: `${searchQuery}%` },
    pause: true,
  });

  useEffect(() => {
    let newList: ExistingItem[] = [];
    if (!queryResult.fetching && queryResult.data) {
      newList = queryResult.data.characters.nodes.map((character) => {
        return {
          itemId: character.id,
          name: character.name,
          imageUrl: character.characterImage.url,
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

export default SelectedCharactersTab;
