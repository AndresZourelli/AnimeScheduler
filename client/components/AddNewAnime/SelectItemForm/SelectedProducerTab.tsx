import { ExistingItem } from "@/components/AddNewAnime/SelectItemForm/ItemSearchBar";
import { useGetProducersQuery } from "@/graphql";
import { useEffect, useState } from "react";
import DisplayItems from "./DisplayItems";

const SelectedProducerTab = ({
  newListName = null,
  existingListName = null,
  placeholder,
  newItemComponent = null,
  addItemTitle,
}) => {
  const [modifiedResult, setModifiedResult] = useState<ExistingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryResult, callQuery] = useGetProducersQuery({
    variables: { like: `${searchQuery}%` },
    pause: true,
  });

  useEffect(() => {
    let newList: ExistingItem[] = [];
    if (!queryResult.fetching && queryResult.data) {
      newList = queryResult.data.producers.nodes.map((producer) => {
        return {
          itemId: producer.id,
          name: producer.producer,
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

export default SelectedProducerTab;
