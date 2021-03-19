import Nav from "@/components/Nav";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { Spinner, Box, Flex, Heading, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import { v4 as uuidv4 } from "uuid";

const GET_CHARACTER = gql`
  query GetCharacter($character_id: ID!) {
    getCharacter(character_id: $character_id) {
      actor
      animes
      name
      image_url
      role
    }
  }
`;

const staffPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_CHARACTER, {
    variables: { character_id: id },
    skip: !id,
  });

  const character = data?.getCharacter;
  console.log(character);

  if (!id || !character || loading) {
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
          <Text>Voice Actor: {character.actor}</Text>
          <Text as="div">
            Appears In:
            <Box mx="2">
              {character.animes.map((anime) => (
                <Text key={uuidv4()} mb="2" fontSize="sm">
                  {anime}
                </Text>
              ))}
            </Box>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default staffPage;
