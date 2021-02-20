import NextImage from "next/image";
import { Box, Heading, Badge } from "@chakra-ui/react";

const AnimeCard = ({ title, image_url, score }) => {
  return (
    <Box
      overflow="hidden"
      d="flex"
      alignItems="center"
      flexDirection="column"
      position="relative"
      overflow="hidden"
      height="100%"
      minH="350px"
      w="200px"
      flex="0 0 auto">
      <Badge
        position="absolute"
        zIndex="100"
        right="5"
        top="5"
        variant="solid"
        colorScheme="green"
        opacity="1">
        {score}
      </Badge>
      <Box width="100%" height="80%" position="relative" display="block">
        <NextImage src={image_url} alt={title} layout="fill" top="0" />
      </Box>
      <Heading
        height="20%"
        display="inline-block"
        width="calc(100%)"
        pt="3"
        size="xs"
        wordBreak="normal"
        textAlign="center"
        justifySelf="center"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis">
        {title}
      </Heading>
    </Box>
  );
};

export default AnimeCard;
