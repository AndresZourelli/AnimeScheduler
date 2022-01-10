import ImageLoader from "@/components/Common/ImageLoader";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const CharacterCard = ({ character, role, actor, language }) => {
  return (
    <HStack
      justifyContent="space-between"
      minH="full"
      w="350px"
      bg="rgba(0, 0, 0, 0.2)"
    >
      <HStack maxW="175px">
        <NextLink href={`/characters/${character.id}`}>
          <Box
            minW="60px"
            minH="90px"
            position="relative"
            display="block"
            cursor="pointer"
          >
            <ImageLoader
              image_url={character.characterImage.url}
              alt={character.name}
              maxW="60px"
            />
          </Box>
        </NextLink>
        <Stack
          height="full"
          justifyContent="space-between"
          minH="90px"
          width="full"
        >
          <Text fontSize="sm">{character.name} </Text>
          <Text fontSize="sm">{role} </Text>
        </Stack>
      </HStack>

      <HStack maxW="175px">
        <Stack
          justifyContent="space-between"
          height="full"
          textAlign="end"
          minH="90px"
        >
          <Text fontSize="sm">
            {actor.firstName + " " + (actor.lastName ?? "")}{" "}
          </Text>
          <Text fontSize="sm">{language} </Text>
        </Stack>
        <Box>
          <NextLink href={`/person/${actor.id}`}>
            <Box
              minW="60px"
              minH="90px"
              position="relative"
              display="block"
              cursor="pointer"
            >
              <ImageLoader
                image_url={actor.personImage.url}
                alt={actor.firstName + " " + (actor.lastName ?? "")}
                maxW="60px"
              />
            </Box>
          </NextLink>
        </Box>
      </HStack>
    </HStack>
  );
};

export default CharacterCard;
