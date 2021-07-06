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
import NewStudio from "@/components/NewStudio";

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
        placeholder="Search For Existing Studio"
        newItem={<NewStudio values={values} setFieldValue={setFieldValue} />}
      />
      <Heading>Added Studios</Heading>
      <Flex wrap="wrap">
        <>
          <FieldArray name="newStudiosList">
            {({ push, remove }) => (
              <>
                {values.newStudiosList
                  .filter((value) => value.studioName != "")
                  .map((studio, studioIndex) => (
                    <Box key={studioIndex} w="full">
                      {studio.studioName}
                      <CloseButton
                        color="red.500"
                        onClick={() => remove(studioIndex)}
                      />
                    </Box>
                  ))}
              </>
            )}
          </FieldArray>
          <FieldArray name="studioList">
            {({ push, remove }) => (
              <>
                {values.studioList
                  .filter((value) => value.studioId != "")
                  .map((studio, studioIndex) => (
                    <Box w="full" key={studioIndex}>
                      {studio.studioId}
                      <CloseButton
                        color="red.500"
                        onClick={() => remove(studioIndex)}
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
