import InfoSearchTab from "@/components/AddNewAnime/InfoSearchTab";
import NewStaff from "@/components/AddNewAnime/NewStaff";
import { Box, CloseButton, Flex, Heading, Text, theme } from "@chakra-ui/react";
import { FieldArray } from "formik";
import { useFieldArray, useFormContext } from "react-hook-form";
import StaffSearchBar from "@/components/AddNewAnime/StaffSearchBar";
import { transparentize } from "@chakra-ui/theme-tools";
import ImageLoader from "@/components/Common/ImageLoader";

const StaffTab = ({ inputSpacingCommon }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "newStaffList",
  });
  const {
    fields: personListFields,
    append: appendPersonList,
    remove: removePersonList,
  } = useFieldArray({
    name: "staffList",
  });
  return (
    <>
      <StaffSearchBar
        fields={fields}
        newPersonAppend={append}
        existingPersonAppend={appendPersonList}
      />
      <Heading>Added Staff</Heading>
      <Flex wrap="wrap" gap={2}>
        {fields.map((name, nameIndex) => (
          <Flex
            key={nameIndex}
            py="2"
            px="2"
            borderRadius={"md"}
            bg={transparentize("gray.500", 0.4)(theme)}
            gap="3"
            minW="250px"
            justifyContent="space-between"
          >
            <Text>{name.givenNameSearchBar + " " + name.surnameSearchBar}</Text>
            <Box w="70px" h="100px" position="relative">
              <ImageLoader
                image_url={name.imageUrl}
                alt={name.name}
                maxW="70px"
                minH="100px"
              />
            </Box>
            <CloseButton color="red.500" onClick={() => remove(nameIndex)} />
          </Flex>
        ))}

        {personListFields.map((name, nameIndex) => (
          <Flex
            key={nameIndex}
            py="2"
            px="2"
            borderRadius={"md"}
            bg={transparentize("gray.500", 0.4)(theme)}
            gap="3"
            minW="250px"
            justifyContent="space-between"
          >
            <Text>{name.name}</Text>
            <Box w="70px" position="relative">
              <ImageLoader
                image_url={name.imageUrl}
                alt={name.name}
                maxW="70px"
              />
            </Box>
            <CloseButton
              color="red.500"
              onClick={() => removePersonList(nameIndex)}
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default StaffTab;
