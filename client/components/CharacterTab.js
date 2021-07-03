import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Heading,
  Select,
  InputRightElement,
  InputGroup,
  CloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Spacer,
  InputLeftElement,
} from "@chakra-ui/react";
import { FieldArray, Field, getIn } from "formik";
import InfoSearchTab from "@/components/InfoSearchTab";
import NewCharacter from "@/components/NewCharacter";

const CharacterTab = ({
  values,
  errors,
  touched,
  handleChange,
  inputSpacingCommon,
  setFieldValue,
}) => {
  return (
    <>
      <InfoSearchTab
        values={values}
        setFieldValue={setFieldValue}
        placeholder="Search For Existing Character"
        newItem={
          <NewCharacter
            values={values}
            setFieldValue={setFieldValue}
           />
        }
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
