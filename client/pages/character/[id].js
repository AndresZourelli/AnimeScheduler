import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import {
  Spinner,
  Box,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { initializeApollo } from "@/lib/apolloClient";
import ImageLoader from "@/components/Common/ImageLoader";
import NextLink from "next/link";

const GET_CHARACTER = gql`
  query GetCharacter($character_id: ID!) {
    getCharacter(character_id: $character_id) {
      actors {
        id
        name
        image_url
        actor_language
      }
      animes {
        anime
        id
      }
      name
      image_url
      role
    }
  }
`;

const GET_PATHS = gql`
  query GetPaths {
    getCharacterPaths {
      id
    }
  }
`;
const characterPage = ({ character }) => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || !character) {
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
          <ImageLoader image_url={character.image_url} alt={character.name} />
        </Box>
        <Box ml="6" position="relative">
          <Heading>{character.name}</Heading>
          <Text>Role: {character.role}</Text>
          <Heading mt="12" as="h3">
            Voice Actor:
          </Heading>
          <Box mx="2">
            <Table>
              <Thead>
                <Tr>
                  <Th>Actor</Th>
                  <Th>Language</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {character.actors?.map((anime) => (
                  <Tr key={anime.id} mb="2" fontSize="sm">
                    <Td>
                      <NextLink href={`/actor/${anime.id}`}>
                        {anime.name}
                      </NextLink>
                    </Td>
                    <Td>{anime.actor_language}</Td>
                    <Td>
                      <Box w="125px" h="179px" position="relative">
                        <ImageLoader
                          image_url={anime.image_url}
                          alt={anime.name}
                        />
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Heading mt="12" as="h3">
            Appears In:
          </Heading>
          <Box mx="2">
            <Table>
              <Thead>
                <Tr>
                  <Th>Anime</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {character.animes?.map((anime) => (
                  <Tr key={anime.id} mb="2" fontSize="sm">
                    <Td>{anime.anime}</Td>
                    <Td />
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export const getStaticPaths = async () => {
  const client = initializeApollo();
  const { data } = await client.query({ query: GET_PATHS });
  let formatedData = data?.getCharacterPaths?.map((item) => ({
    params: {
      id: item.id,
    },
  }));

  return {
    paths: formatedData,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const client = initializeApollo();
  const { data } = await client.query({
    query: GET_CHARACTER,
    variables: { character_id: id },
  });
  return {
    props: {
      character: data.getCharacter,
    },
  };
};

export default characterPage;
