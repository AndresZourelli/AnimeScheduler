import NewExternalLink from "@/components/NewExternalLink";
import { Box, CloseButton, Flex, Heading } from "@chakra-ui/react";
import { FieldArray } from "formik";

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
      <Heading>Added External Links</Heading>
      <NewExternalLink values={values} setFieldValue={setFieldValue} />
      <Flex wrap="wrap">
        <>
          <FieldArray name="externalLinks">
            {({ push, remove }) => (
              <>
                {values.externalLinks
                  .filter((value) => value.externalLinks != "")
                  .map((externalLink, externalLinkIndex) => (
                    <Box w="full" key={externalLinkIndex}>
                      {externalLink.linkName}
                      <CloseButton
                        color="red.500"
                        onClick={() => remove(externalLinkIndex)}
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
