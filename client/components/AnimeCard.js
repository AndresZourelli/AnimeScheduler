import NextImage from "next/image";
import { Box, Heading, Badge } from "@chakra-ui/react";

const AnimeCard = ({ title, image_url, score }) => {
  return (
    <Box
      overflow="hidden"
      d="flex"
      alignItems="center"
      flexDirection="column"
      h="325px"
      w="200px"
      position="relative">
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
      <NextImage src={image_url} alt={title} height={275} width={175} />
      <Heading
        pt="3"
        size="xs"
        overflow="hidden"
        wordBreak="normal"
        textAlign="center"
        justifySelf="center">
        {title}
      </Heading>
    </Box>
  );
};

export default AnimeCard;
