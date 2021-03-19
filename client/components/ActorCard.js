import NextImage from "next/image";
import { Box, Heading, Text } from "@chakra-ui/react";

const ActorCard = ({ actor: { id, name, image_url, actor_language } }) => {
  return (
    <Box
      overflow="hidden"
      d="flex"
      alignItems="center"
      flexDirection="column"
      position="relative"
      overflow="hidden"
      minH="150px"
      w="200px"
      flex="0 0 auto">
      <Heading
        height="20%"
        display="block"
        width="calc(100%)"
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
      <Box width="42px" height="62px" position="relative" display="block">
        <NextImage src={image_url} alt={name} layout="fill" top="0" />
      </Box>
      <Text fontSize="sm">Language: {actor_language} </Text>
    </Box>
  );
};

export default ActorCard;
