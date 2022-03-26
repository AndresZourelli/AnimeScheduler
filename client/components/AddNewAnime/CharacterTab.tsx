import { GetCharactersQuery } from "@/graphql";
import { Box, CloseButton, Flex, Heading, Text, theme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useFieldArray, useFormContext } from "react-hook-form";
import ImageLoader from "../Common/ImageLoader";
import CharacterSearchBar from "./CharacterSearchBar";

type SearchCharacter = GetCharactersQuery["characters"]["nodes"][0];

const CharacterTab = ({ inputSpacingCommon }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "newCharactersList",
  });
  const {
    fields: characterListFields,
    append: appendCharacterList,
    remove: removeCharacterList,
  } = useFieldArray({
    name: "characterList",
  });

  return (
    <>
      <CharacterSearchBar
        fields={fields}
        newCharacterAppend={append}
        existingCharacterAppend={appendCharacterList}
      />
      <Heading>Added Characters</Heading>
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
            <Text>{name.givenNameSearchBar}</Text>
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

        {characterListFields.map((name, nameIndex) => (
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
            <Text>{name.name}</Text>
            <Box w="70px" h="100px" position="relative">
              <ImageLoader
                image_url={name.imageUrl}
                alt={name.name}
                maxW="70px"
                minH="100px"
              />
            </Box>
            <CloseButton
              color="red.500"
              onClick={() => removeCharacterList(nameIndex)}
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default CharacterTab;
