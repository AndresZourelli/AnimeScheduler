import Nav from "@/components/Nav";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { Spinner, Box, Flex, Heading, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import { v4 as uuidv4 } from "uuid";
import { initializeApollo } from "@/lib/apolloClient";

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
            src={character.image_url}
            layout="fill"
            alt={character.name}
          />
        </Box>
        <Box ml="6" position="relative">
          <Heading>{character.name}</Heading>
          <Text>Role: {character.role}</Text>
          <Text>
            Voice Actor:
            <Box mx="2">
              {character.actors?.map((anime) => (
                <Text key={uuidv4()} mb="2" fontSize="sm">
                  {anime.name}
                </Text>
              ))}
            </Box>
          </Text>
          <Text as="div">
            Appears In:
            <Box mx="2">
              {character.animes?.map((anime) => (
                <Text key={uuidv4()} mb="2" fontSize="sm">
                  {anime.anime}
                </Text>
              ))}
            </Box>
          </Text>
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
