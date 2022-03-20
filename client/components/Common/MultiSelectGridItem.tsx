import { GridItem, Heading } from "@chakra-ui/react";
import MultiSelect from "@/components/Common/MultiSelect";
import { filterStyle, Options } from "@/components/Search/SearchFilter";

interface MultiSelectGridItem {
  fieldName: string;
  title: string;
  inputArray: Options[];
}

const MultiSelectGridItem = ({
  fieldName,
  title,
  inputArray,
}: MultiSelectGridItem) => {
  return (
    <GridItem>
      <Heading
        size={filterStyle.advancedFilter.headingSize}
        mb={filterStyle.advancedFilter.marginBottom}
      >
        {title}
      </Heading>
      <MultiSelect itemOptions={inputArray} fieldName={fieldName} />
    </GridItem>
  );
};

export default MultiSelectGridItem;
