import { ExistingItem } from "@/components/AddNewAnime/SelectItemForm/ItemSearchBar";
import { useGetLicensorsQuery } from "@/graphql";
import { useEffect, useState } from "react";
import DisplayItems from "./DisplayItems";

const SelectedLicensorTab = ({
  newListName = null,
  existingListName = null,
  placeholder,
  newItemComponent = null,
  addItemTitle,
}) => {
  const [modifiedResult, setModifiedResult] = useState<ExistingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryResult, callQuery] = useGetLicensorsQuery({
    variables: { like: `${searchQuery}%` },
    pause: true,
  });

  useEffect(() => {
    let newList: ExistingItem[] = [];
    if (!queryResult.fetching && queryResult.data) {
      newList = queryResult.data.licensors.nodes.map((licensor) => {
        return {
          itemId: licensor.id,
          name: licensor.licensor,
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

export default SelectedLicensorTab;
