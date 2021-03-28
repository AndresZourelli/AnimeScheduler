import Nav from "@/components/Nav";
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
  Tr,
  Th,
  Td,
  Tbody,
} from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { initializeApollo } from "@/lib/apolloClient";
import ImageLoader from "@/components/ImageLoader";

const GET_ACTOR = gql`
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

const GET_PATHS = gql`
  query GetPaths {
    getActorPaths {
      id
    }
  }
`;

const actorPage = ({ actor }) => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || !actor) {
    return (
      <Box>
        <Nav />
        <Spinner size="xl" display="block" m="auto" my="10"></Spinner>
      </Box>
    );
  }

  return (
    <Box>
      <Nav />
      <Flex justifyContent="flex-start" p="6">
        <Box w="225px" h="350px" position="relative" m="2">
          <NextImage
            style={{ position: "relative" }}
            src={actor.image_url}
            layout="fill"
            alt={actor.name}
          />
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
                  <Th></Th>
                  <Th>Anime</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {actor?.animes?.map((anime) => (
                  <Tr key={anime.anime.id}>
                    <Td mb="2" fontSize="sm">
                      <NextLink
                        href={`/character/${encodeURIComponent(
                          anime.character.character_id
                        )}`}>
                        {anime.character.name}
                      </NextLink>
                    </Td>
                    <Td>
                      <Box w="125px" h="179px" position="relative">
                        <ImageLoader
                          image_url={anime.character.image_url}
                          alt={anime.character.name}></ImageLoader>
                      </Box>
                    </Td>
                    <Td mb="2" fontSize="sm">
                      <NextLink
                        href={`/anime/${encodeURIComponent(anime.anime.id)}`}>
                        {anime.anime.title}
                      </NextLink>
                    </Td>
                    <Td>
                      <Box w="125px" h="179px" position="relative">
                        <ImageLoader
                          image_url={anime.anime.image_url}
                          alt={anime.anime.name}></ImageLoader>
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

export const getStaticPaths = async () => {
  const client = initializeApollo();
  const { data } = await client.query({ query: GET_PATHS });
  let formatedData = data?.getActorPaths?.map((item) => ({
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
    query: GET_ACTOR,
    variables: { actor_id: id },
  });
  return {
    props: {
      actor: data.getActor,
    },
  };
};

export default actorPage;
