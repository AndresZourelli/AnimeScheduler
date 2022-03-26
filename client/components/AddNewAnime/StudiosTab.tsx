import StudioSearchBar from "@/components/AddNewAnime/StudioSearchBar";
import { Box, CloseButton, Flex, Heading, theme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useFieldArray, useFormContext } from "react-hook-form";

const StudioTab = ({ inputSpacingCommon }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "newStudiosList",
  });
  const {
    fields: studioListFields,
    append: appendStudioList,
    remove: removeStudioList,
  } = useFieldArray({
    name: "studioList",
  });
  return (
    <>
      <StudioSearchBar
        newStudioAppend={append}
        existingStudioAppend={appendStudioList}
      />
      <Heading>Added Studios</Heading>
      <Flex wrap="wrap" gap={2}>
        {fields.map((studio, studioIndex) => (
          <Flex
            key={studioIndex}
            py="2"
            px="2"
            borderRadius={"md"}
            bg={transparentize("gray.500", 0.4)(theme)}
            gap="3"
            minW="250px"
            justifyContent="space-between"
          >
            {/*  @ts-ignore */}
            {studio.studioName}
            <CloseButton color="red.500" onClick={() => remove(studioIndex)} />
          </Flex>
        ))}

        {studioListFields.map((studio, studioIndex) => (
          <Flex
            key={studioIndex}
            py="2"
            px="2"
            borderRadius={"md"}
            bg={transparentize("gray.500", 0.4)(theme)}
            gap="3"
            minW="250px"
            justifyContent="space-between"
          >
            {/*  @ts-ignore */}
            {studio.studioName}
            <CloseButton
              color="red.500"
              onClick={() => removeStudioList(studioIndex)}
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default StudioTab;
