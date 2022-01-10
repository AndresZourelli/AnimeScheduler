import { useRouter } from "next/router";
import {
  Spinner,
  Box,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import ImageLoader from "@/components/Common/ImageLoader";

const GET_ACTOR = `
  query GetActor($actor_id: ID!) {
    getActor(actor_id: $actor_id) {
      id
      name
      image_url
      animes {
        anime {
          title
          image_url
          id
        }
        character {
          name
          image_url
          character_id
        }
      }
      actor_language
    }
  }
`;

const GET_PATHS = `
  query GetPaths {
    getActorPaths {
      id
    }
  }
`;

const ActorPage = ({ actor }) => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || !actor) {
    return (
      <Box>
        <Spinner size="xl" display="block" m="auto" my="10" />
      </Box>
    );
  }

  return (
    <Box>
      <Flex justifyContent="flex-start" p="6">
        <Box w="225px" h="350px" position="relative" m="2">
          <NextImage src={actor.image_url} layout="fill" alt={actor.name} />
        </Box>
        <Box ml="6" position="relative">
          <Heading>{actor.name}</Heading>
          <Text>Actor Language: {actor.actor_language}</Text>
          <Text as="div">
            Appears In:
            <Table mx="2" variant="simple">
              <Thead>
                <Tr>
                  <Th>Character Name</Th>
                  <Th />
                  <Th>Anime</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {actor?.animes?.map((anime) => (
                  <Tr key={anime.anime.id}>
                    <Td mb="2" fontSize="sm">
                      <NextLink
                        href={`/characters/${encodeURIComponent(
                          anime.character.character_id
                        )}`}
                      >
                        {anime.character.name}
                      </NextLink>
                    </Td>
                    <Td>
                      <Box w="125px" h="179px" position="relative">
                        <ImageLoader
                          image_url={anime.character.image_url}
                          alt={anime.character.name}
                          maxW="125px"
                        />
                      </Box>
                    </Td>
                    <Td mb="2" fontSize="sm">
                      <NextLink
                        href={`/animes/${encodeURIComponent(anime.anime.id)}`}
                      >
                        {anime.anime.title}
                      </NextLink>
                    </Td>
                    <Td>
                      <Box w="125px" h="179px" position="relative">
                        <ImageLoader
                          image_url={anime.anime.image_url}
                          alt={anime.anime.name}
                          maxW="125px"
                        />
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ActorPage;
