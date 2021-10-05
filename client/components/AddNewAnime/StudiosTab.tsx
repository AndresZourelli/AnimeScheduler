import InfoSearchTab from "@/components/AddNewAnime/InfoSearchTab";
import NewStudio from "@/components/AddNewAnime/NewStudio";
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
