import { Box, CloseButton, Flex, Heading, theme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useFieldArray, useFormContext } from "react-hook-form";
import LicensorSearchBar from "@/components/AddNewAnime/LicensorsSearchBar";

const LicensorTab = ({ inputSpacingCommon }) => {
  const { fields, append, remove } = useFieldArray({
    name: "newLicensorsList",
  });
  const {
    fields: licensorListFields,
    append: appendLicensorList,
    remove: removeLicensorList,
  } = useFieldArray({
    name: "licensorList",
  });
  return (
    <>
      <LicensorSearchBar
        fields={licensorListFields}
        newLicensorAppend={append}
        existingLicensorAppend={appendLicensorList}
      />
      <Heading>Added Licensors</Heading>
      <Flex wrap="wrap" gap={2}>
        {fields.map((licensor, licensorIndex) => (
          <Flex
            key={licensorIndex}
            py="2"
            px="2"
            borderRadius={"md"}
            bg={transparentize("gray.500", 0.4)(theme)}
            gap="3"
            minW="250px"
            justifyContent="space-between"
          >
            {/*  @ts-ignore */}
            {licensor.name}
            <CloseButton
              color="red.500"
              onClick={() => remove(licensorIndex)}
            />
          </Flex>
        ))}

        {licensorListFields.map((licensor, licensorIndex) => (
          <Flex
            key={licensorIndex}
            py="2"
            px="2"
            borderRadius={"md"}
            bg={transparentize("gray.500", 0.4)(theme)}
            gap="3"
            minW="250px"
            justifyContent="space-between"
          >
            {/*  @ts-ignore */}
            {licensor.name}
            <CloseButton
              color="red.500"
              onClick={() => removeLicensorList(licensorIndex)}
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default LicensorTab;
