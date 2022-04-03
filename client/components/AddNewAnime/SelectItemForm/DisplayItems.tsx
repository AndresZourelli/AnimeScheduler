import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, CloseButton, Flex, Heading, Text, theme } from "@chakra-ui/react";
import ImageLoader from "@/components/Common/ImageLoader";
import { transparentize } from "@chakra-ui/theme-tools";
import ItemSearchBar from "@/components/AddNewAnime/SelectItemForm/ItemSearchBar";
import { isStringNullOrUndefined } from "@/utilities/helperFunctions";

const DisplayItems = ({
  newListName = null,
  existingListName = null,
  placeholder,
  queryResult,
  newItemComponent = null,
  setSearchQuery,
  addItemTitle,
}) => {
  const {
    fields: newItemListFields,
    append: appendNewItem,
    remove: removeNewItem,
  } = useFieldArray({
    name: newListName,
  });
  const {
    fields: existingItemListFields,
    append: appendExistingItem,
    remove: removeExistingItem,
  } = useFieldArray({
    name: existingListName,
  });
  return (
    <Box>
      <ItemSearchBar
        appendExistingItem={appendExistingItem}
        appendNewItem={appendNewItem}
        existingFields={existingItemListFields}
        placeholder={placeholder}
        queryResult={queryResult}
        newComponent={newItemComponent}
        setSearch={setSearchQuery}
      />
      <Heading>{addItemTitle}</Heading>
      <Flex wrap="wrap" gap={2}>
        {newItemListFields &&
          newItemListFields.map((name, nameIndex) => (
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
              {/*  @ts-ignore */}
              <Text>{name.name}</Text>
              {/*  @ts-ignore */}
              {!isStringNullOrUndefined(name?.imageFile?.preview) && (
                <Box w="70px" h="100px" position="relative">
                  <ImageLoader
                    // @ts-ignore
                    image_url={name?.imageFile?.preview}
                    // @ts-ignore
                    alt={name.name}
                    maxW="70px"
                    minH="100px"
                  />
                </Box>
              )}
              <CloseButton
                color="red.500"
                onClick={() => removeNewItem(nameIndex)}
              />
            </Flex>
          ))}

        {existingItemListFields &&
          existingItemListFields.map((name, nameIndex) => (
            <Flex
              key={nameIndex}
              minW="250px"
              gap={3}
              justifyContent="space-between"
              bg={transparentize("gray.500", 0.4)(theme)}
              borderRadius={"md"}
              py="2"
              px="2"
            >
              {/*  @ts-ignore */}
              <Text>{name.name}</Text>
              {/*  @ts-ignore */}
              {!isStringNullOrUndefined(name.imageUrl) && (
                <Box w="70px" h="100px" position="relative">
                  <ImageLoader
                    // @ts-ignore
                    image_url={name.imageUrl}
                    // @ts-ignore
                    alt={name.name}
                    maxW="70px"
                    minH="100px"
                  />
                </Box>
              )}

              <CloseButton
                color="red.500"
                onClick={() => removeExistingItem(nameIndex)}
              />
            </Flex>
          ))}
      </Flex>
    </Box>
  );
};

export default DisplayItems;
