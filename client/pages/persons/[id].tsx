/* eslint-disable react-hooks/rules-of-hooks */
import ImageLoader from "@/components/Common/ImageLoader";
import {
  Box,
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "urql";
import { v4 as uuidv4 } from "uuid";

const GET_PERSON = `
  query GetPerson($personId: UUID!) {
    person(id: $personId) {
      id
      firstName
      lastName
      description
      malId
      animeCharacters {
        nodes {
          character {
            id
            name
            characterImage {
              url
            }
          }
          characterRole {
            role
          }
          anime {
          title
          id
          profileImage {
            url
          }
        }
        }
      }
      animeStaffs {
        nodes {
          anime {
            title
            id
            profileImage {
              url
            }
          }
          staffRole {
            role
          }
        }
      }
      personImage {
      url
    }
    }
  }
`;

const personPage = ({ staff }) => {
  const router = useRouter();
  const { id } = router.query;
  const [personResult, personQuery] = useQuery({
    query: GET_PERSON,
    variables: { personId: id },
  });
  if (!id || !personResult.data) {
    return (
      <Box>
        <Spinner size="xl" display="block" m="auto" my="10" />
      </Box>
    );
  }
  const {
    animeCharacters,
    animeStaffs,
    description,
    firstName,
    lastName,
    id: person_id,
    personImage,
  } = personResult.data?.person;
  return (
    <Box>
      <Flex justifyContent="flex-start" p="6">
        <Box w="225px" h="350px" position="relative" m="2">
          <NextImage
            src={personImage?.url}
            layout="fill"
            alt={firstName + " " + (lastName ?? "")}
          />
        </Box>
        <Box ml="6" position="relative">
          <Heading>{firstName + " " + (lastName ?? "")}</Heading>
          {animeCharacters.nodes.length > 0 ? (
            <Box ml="6" position="relative">
              <Text as="div">
                Voiced Characters In:
                <Table mx="2" variant="simple" size="lg">
                  <Thead>
                    <Tr>
                      <Th>Anime</Th>
                      <Th textAlign="center">Character</Th>
                      <Th />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {animeCharacters?.nodes?.map((character) => (
                      <Tr key={uuidv4()}>
                        <Td>
                          <NextLink
                            href={`/animes/${encodeURIComponent(
                              character.anime.id
                            )}`}
                          >
                            <Box
                              w="125px"
                              h="179px"
                              position="relative"
                              ml="2"
                              display="inline-block"
                              cursor="pointer"
                            >
                              <ImageLoader
                                image_url={character.anime.profileImage.url}
                                alt={character.anime.title}
                                maxW="125px"
                              />
                            </Box>
                          </NextLink>
                        </Td>
                        <Td key={uuidv4()} fontSize="sm" textAlign="center">
                          <NextLink
                            href={`/animes/${encodeURIComponent(
                              character.anime.id
                            )}`}
                          >
                            {character.anime.title}
                          </NextLink>
                        </Td>
                        <Td>
                          <NextLink
                            href={`/characters/${encodeURIComponent(
                              character.character.id
                            )}`}
                          >
                            <Box
                              w="125px"
                              h="179px"
                              position="relative"
                              ml="2"
                              display="inline-block"
                              cursor="pointer"
                            >
                              <ImageLoader
                                image_url={
                                  character.character.characterImage.url
                                }
                                alt={character.character.name}
                                maxW="125px"
                              />
                            </Box>
                          </NextLink>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Text>
            </Box>
          ) : null}

          {animeStaffs.nodes.length > 0 ? (
            <Box>
              Staff In:
              <Table mx="2" variant="simple" size="lg">
                <Thead>
                  <Tr>
                    <Th>Role</Th>
                    <Th textAlign="center">Anime</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {animeStaffs?.nodes?.map((staff) => (
                    <Tr key={uuidv4()}>
                      <Td key={uuidv4()} fontSize="sm">
                        {staff.staffRole.role}
                      </Td>
                      <Td key={uuidv4()} fontSize="sm" textAlign="center">
                        <NextLink
                          href={`/animes/${encodeURIComponent(staff.anime.id)}`}
                        >
                          {staff.anime.title}
                        </NextLink>
                      </Td>
                      <Td>
                        <NextLink
                          href={`/animes/${encodeURIComponent(staff.anime.id)}`}
                        >
                          <Box
                            w="125px"
                            h="179px"
                            position="relative"
                            ml="2"
                            display="inline-block"
                          >
                            <ImageLoader
                              image_url={staff.anime.profileImage.url}
                              alt={staff.anime.title}
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
          ) : null}
        </Box>
      </Flex>
    </Box>
  );
};

export default personPage;
