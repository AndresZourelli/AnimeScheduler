import { ExistingItem } from "@/components/AddNewAnime/SelectItemForm/ItemSearchBar";
import { useGetPeopleQuery } from "@/graphql";
import { useEffect, useState } from "react";
import DisplayItems from "./DisplayItems";

const SelectedStaffTab = ({
  newListName = null,
  existingListName = null,
  placeholder,
  newItemComponent = null,
  addItemTitle,
}) => {
  const [modifiedResult, setModifiedResult] = useState<ExistingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryResult, callQuery] = useGetPeopleQuery({
    variables: { like: `${searchQuery}%` },
    pause: true,
  });

  useEffect(() => {
    let newList: ExistingItem[] = [];
    if (!queryResult.fetching && queryResult.data) {
      newList = queryResult.data.people.nodes.map((people) => {
        return {
          itemId: people.id,
          name: people.firstName + " " + (people.lastName ?? ""),
          imageUrl: people.personImage.url,
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

export default SelectedStaffTab;
