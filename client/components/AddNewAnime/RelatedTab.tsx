import RelatedMediaSearchBar from "@/components/AddNewAnime/RelatedMediaSearchBar";
import { Box, CloseButton, Flex, Heading, Text, theme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useFieldArray } from "react-hook-form";
import ImageLoader from "../Common/ImageLoader";

const RelatedTab = ({ inputSpacingCommon }) => {
  const {
    fields: relatedMediaListFields,
    append: appendrelatedMediaList,
    remove: removerelatedMediaList,
  } = useFieldArray({
    name: "relatedMediaList",
  });
  return (
    <>
      <RelatedMediaSearchBar append={appendrelatedMediaList} />
      <Heading>Added Related Material</Heading>
      <Flex wrap="wrap" gap={2}>
        {relatedMediaListFields.map((relatedMedia, relatedMediaIndex) => (
          <Flex
            key={relatedMediaIndex}
            minW="250px"
            gap={3}
            justifyContent="space-between"
            bg={transparentize("gray.500", 0.4)(theme)}
            borderRadius={"md"}
            py="2"
            px="2"
          >
            {/*  @ts-ignore */}
            <Text>{relatedMedia.name}</Text>
            <Box w="70px" h="100px" position="relative">
              <ImageLoader
                // @ts-ignore
                image_url={relatedMedia.imageUrl}
                // @ts-ignore
                alt={relatedMedia.name}
                maxW="70px"
                minH="100px"
              />
            </Box>
            <CloseButton
              color="red.500"
              onClick={() => removerelatedMediaList(relatedMediaIndex)}
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default RelatedTab;
