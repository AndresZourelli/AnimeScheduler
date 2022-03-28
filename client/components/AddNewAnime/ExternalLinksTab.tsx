import NewExternalLink from "@/components/AddNewAnime/NewExternalLink";
import { Box, CloseButton, Flex, Heading, Text, theme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { FieldArray } from "formik";
import { useFieldArray } from "react-hook-form";

const ExternalLinksTab = () => {
  const {
    fields: externalLinksListFields,
    append: appendExternalLinksList,
    remove: removeExternalLinksList,
  } = useFieldArray({
    name: "externalLinks",
  });
  return (
    <>
      <Flex justifyContent="space-between" mb={3}>
        <Heading>Add External Links</Heading>
        <NewExternalLink append={appendExternalLinksList} />
      </Flex>
      <Flex wrap="wrap" gap={2}>
        {externalLinksListFields.map((externalLink, externalLinkIndex) => (
          <Flex
            key={externalLinkIndex}
            minW="250px"
            gap={3}
            justifyContent="space-between"
            bg={transparentize("gray.500", 0.4)(theme)}
            borderRadius={"md"}
            py="2"
            px="2"
          >
            {/*  @ts-ignore */}
            <Text>{externalLink.name}</Text>
            <CloseButton
              color="red.500"
              onClick={() => removeExternalLinksList(externalLinkIndex)}
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default ExternalLinksTab;
