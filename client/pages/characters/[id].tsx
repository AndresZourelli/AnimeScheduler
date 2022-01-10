/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
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
import ImageLoader from "@/components/Common/ImageLoader";
import NextLink from "next/link";
import { useQuery } from "urql";
import ReadMore from "@/components/Common/ReadMore";

const GET_CHARACTER = `
  query GetCharacter($characterId: UUID!) {
    character(id: $characterId) {
      name
      description
      animeCharacters {
        nodes {
          anime {
            title
            id
          }
          language {
            language
          }
          person {
            firstName
            lastName
            id
            personImage {
              url
            }
          }
        }
      }
      characterImage {
        url
      }
      voiceActors(first: 10) {
        nodes {
          actorFirstName
          actorLastName
          language
          personImageUrl
          voiceActorId
        }
      }
      characterAnimePreviews(first: 10) {
        nodes {
          title
          animeImageUrl
          animeId
        }
      }
    }
  }
`;

const characterPage = ({ character }) => {
  const router = useRouter();
  const { id } = router.query;
  const [characterResult, characterQuery] = useQuery({
    query: GET_CHARACTER,
    variables: { characterId: id },
  });
  if (!id || !characterResult.data) {
    return (
      <Box>
        <Spinner size="xl" display="block" m="auto" my="10" />
      </Box>
    );
  }
  const {
    name,
    description,
    animeCharacters,
    characterImage,
    voiceActors,
    characterAnimePreviews,
  } = characterResult.data.character;

  return (
    <Box>
      <Flex justifyContent="flex-start" p="6">
        <Box minW="225px" h="350px" position="relative" m="2">
          <ImageLoader
            image_url={characterImage?.url}
            alt={name}
            maxW="225px"
          />
        </Box>
        <Box ml="6" position="relative">
          <Heading>{name}</Heading>
          <ReadMore text={description} />
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
                {voiceActors?.nodes?.map((actor) => (
                  <Tr key={actor?.voiceActorId} mb="2" fontSize="sm">
                    <Td>
                      <NextLink href={`/person/${actor?.voiceActorId}`}>
                        {actor?.actorFirstName +
                          " " +
                          (actor?.actorLastName ?? "")}
                      </NextLink>
                    </Td>
                    <Td>{actor?.language}</Td>
                    <Td>
                      <NextLink href={`/person/${actor?.voiceActorId}`}>
                        <Box
                          w="125px"
                          h="179px"
                          position="relative"
                          cursor="pointer"
                        >
                          <ImageLoader
                            image_url={actor?.personImageUrl}
                            alt={
                              actor?.actorFirstName +
                              " " +
                              (actor?.actorLastName ?? "")
                            }
                            maxW="125px"
                          />
                        </Box>
                      </NextLink>
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
                {characterAnimePreviews?.nodes?.map((anime) => (
                  <Tr key={anime?.animeId} mb="2" fontSize="sm">
                    <Td>{anime?.title}</Td>
                    <Td>
                      <Box w="125px" h="179px" position="relative">
                        <ImageLoader
                          image_url={anime?.animeImageUrl}
                          alt={anime?.title}
                          maxW="125px"
                        />
                      </Box>
                    </Td>
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

export default characterPage;
