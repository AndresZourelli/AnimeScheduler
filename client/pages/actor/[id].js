import Nav from "@/components/Nav";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { Spinner, Box, Flex, Heading, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import { v4 as uuidv4 } from "uuid";

const GET_ACTOR = gql`
  query GetActor($actor_id: ID!) {
    getActor(actor_id: $actor_id) {
        id
    name
    image_url
    animes{
      anime
      character
    }
    actor_language
  }
    }
  }
`;

const staffPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_ACTOR, {
    variables: { character_id: id },
    skip: !id,
  });

  const actor = data?.getActor;
  console.log(actor);

  if (!id || !actor || loading) {
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
          <Text>Role: {actor.role}</Text>
          <Text>Voice Actor: {actor.actor}</Text>
          <Text as="div">
            Appears In:
            <Box mx="2">
              {actor.animes.map((anime) => (
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
