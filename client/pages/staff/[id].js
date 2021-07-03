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
import { v4 as uuidv4 } from "uuid";
import { initializeApollo } from "@/lib/apolloClient";
import ImageLoader from "@/components/ImageLoader";

const GET_STAFF = gql`
  query GetStaff($staff_id: ID!) {
    getStaff(staff_id: $staff_id) {
      id
      name
      animes {
        image_url
        title
        id
        role
      }
      image_url
    }
  }
`;

const GET_PATHS = gql`
  query GetPaths {
    getStaffPaths {
      id
    }
  }
`;

const staffPage = ({ staff }) => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || !staff) {
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
          <NextImage
            style={{ position: "relative" }}
            src={staff.image_url}
            layout="fill"
            alt={staff.name}
          />
        </Box>
        <Box ml="6" position="relative">
          <Heading>{staff.name}</Heading>
          <Text as="div">
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
                {staff?.animes?.map((anime) => (
                  <Tr key={uuidv4()}>
                    <Td key={uuidv4()} fontSize="sm">
                      {anime.role}
                    </Td>
                    <Td key={uuidv4()} fontSize="sm" textAlign="center">
                      <NextLink href={`/anime/${encodeURIComponent(anime.id)}`}>
                        {anime.title}
                      </NextLink>
                    </Td>
                    <Td>
                      <Box
                        w="125px"
                        h="179px"
                        position="relative"
                        ml="2"
                        display="inline-block"
                      >
                        <ImageLoader
                          image_url={anime.image_url}
                          alt={anime.title}
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

export const getStaticPaths = async () => {
  const client = initializeApollo();
  const { data } = await client.query({ query: GET_PATHS });
  let formatedData = data?.getStaffPaths?.map((item) => ({
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
    query: GET_STAFF,
    variables: { staff_id: id },
  });
  return {
    props: {
      staff: data.getStaff,
    },
  };
};

export default staffPage;
