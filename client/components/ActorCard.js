import NextImage from "next/image";
import { Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const ActorCard = ({
  actor: { id, name, image_url, actor_language, character },
}) => {
  return (
    <Box
      mb="4"
      overflow="hidden"
      d="flex"
      alignItems="center"
      flexDirection="column"
      position="relative"
      overflow="hidden"
      minH="150px"
      w="200px"
      flex="0 0 auto">
      <NextLink href={`/actor/${id}`}>
        <Box
          m="auto"
          position="relative"
          d="flex"
          flexDirection="column"
          alignItems="center"
          cursor="pointer">
          <Heading
            display="block"
            size="md"
            wordBreak="normal"
            textAlign="center"
            justifySelf="center"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            mb="0">
            {name}
          </Heading>
          <Box width="125px" height="194px" position="relative" display="block">
            <NextImage src={image_url} alt={name} layout="fill" top="0" />
          </Box>
          <Text fontSize="sm">Language: {actor_language} </Text>
          <Text fontSize="sm">Character: {character} </Text>
        </Box>
      </NextLink>
    </Box>
  );
};

export default ActorCard;
