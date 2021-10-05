import InfoSearchTab from "@/components/AddNewAnime/InfoSearchTab";
import NewCharacter from "@/components/AddNewAnime/NewCharacter";
import { Box, CloseButton, Flex, Heading } from "@chakra-ui/react";
import { FieldArray } from "formik";

const CharacterTab = ({
  values,
  errors,
  touched,
  handleChange,
  inputSpacingCommon,
  setFieldValue,
  push,
}) => {
  return (
    <>
      <InfoSearchTab
        push={push}
        values={values}
        setFieldValue={setFieldValue}
        placeholder="Search For Existing Character"
        newItem={<NewCharacter values={values} setFieldValue={setFieldValue} />}
      />
      <Heading>Added Characters</Heading>
      <Flex wrap="wrap">
        <>
          <FieldArray name="newCharactersList">
            {({ push, remove }) => (
              <>
                {values.newCharactersList
                  .filter((value) => value.givenNameSearchBar != "")
                  .map((name, nameIndex) => (
                    <Box key={nameIndex} w="full">
                      {name.givenNameSearchBar}
                      <CloseButton
                        color="red.500"
                        onClick={() => remove(nameIndex)}
                      />
                    </Box>
                  ))}
              </>
            )}
          </FieldArray>
          <FieldArray name="characterList">
            {({ push, remove }) => (
              <>
                {values.characterList
                  .filter((value) => value.characterId != "")
                  .map((name, nameIndex) => (
                    <Box w="full" key={nameIndex}>
                      {name.characterId}
                      <CloseButton
                        color="red.500"
                        onClick={() => remove(nameIndex)}
                      />
                    </Box>
                  ))}
              </>
            )}
          </FieldArray>
        </>
      </Flex>
    </>
  );
};

export default CharacterTab;
