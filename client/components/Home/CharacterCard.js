import { Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import ImageLoader from "@/components/Common/ImageLoader";

const CharacterCard = ({
  character: {
    character_id,
    character_name,
    image_url,
    character_role_name,
    actor,
  },
}) => {
  return (
    <Box
      mb="4"
      overflow="hidden"
      d="flex"
      alignItems="center"
      flexDirection="column"
      position="relative"
      minH="150px"
      w="200px"
      flex="0 0 auto"
    >
      <NextLink href={`/character/${character_id}`}>
        <Box
          m="auto"
          position="relative"
          d="flex"
          flexDirection="column"
          alignItems="center"
          cursor="pointer"
        >
          <Heading
            display="block"
            size="md"
            wordBreak="normal"
            textAlign="center"
            justifySelf="center"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            mb="0"
          >
            {character_name}
          </Heading>
          <Box width="125px" height="194px" position="relative" display="block">
            <ImageLoader image_url={image_url} alt={character_name} />
          </Box>
          <Text fontSize="sm">Role: {character_role_name} </Text>
        </Box>
      </NextLink>
    </Box>
  );
};

export default CharacterCard;
