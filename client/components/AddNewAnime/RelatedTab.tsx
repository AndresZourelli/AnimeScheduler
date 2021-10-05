import InfoSearchTab from "@/components/AddNewAnime/InfoSearchTab";
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
        newItem={null}
        values={values}
        setFieldValue={setFieldValue}
        placeholder="Search For Existing Media"
        push={push}
      />
      <Heading>Added Related Material</Heading>
      <Flex wrap="wrap">
        <>
          <FieldArray name="relatedMediaList">
            {({ push, remove }) => (
              <>
                {values.relatedMediaList
                  .filter((value) => value.relatedMediaId != "")
                  .map((relatedMedia, relatedMediaIndex) => (
                    <Box w="full" key={relatedMediaIndex}>
                      {relatedMedia.relatedMediaId}
                      <CloseButton
                        color="red.500"
                        onClick={() => remove(relatedMediaIndex)}
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
