import Nav from "@/components/Nav";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import {
  Spinner,
  Box,
  Heading,
  Tag,
  TagLabel,
  TagLeftIcon,
  Flex,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripfire } from "@fortawesome/free-brands-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";

import NextImage from "next/image";

const GET_ANIME = gql`
  query GetAnime($anime_id: ID!) {
    getAnime(anime_id: $anime_id) {
      id: _id
      title
      avg_score
      description
      image_url
      episodes
      aired_start
      aired_end
      broadcast_day
      broadcast_time
      duration
      type
      season
      source
      status
      rating
      genres
      licensors
      producers
      studios
      alt_names {
        Japanese
        English
        Synonyms
      }
      minutes_watched
    }
  }
`;

const animePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_ANIME, {
    variables: { anime_id: id },
    skip: !id,
  });

  if (!id || loading) {
    return (
      <Box>
        <Nav />
        <Spinner size="xl" display="block" m="auto" my="10"></Spinner>
      </Box>
    );
  }
  const anime = data.getAnime;
  console.log(anime);

  return (
    <Box position="relative">
      <Nav />
      <Flex position="relative">
        <Box height="300px" width="225px" position="relative" m="8">
          <NextImage layout="fill" src={anime.image_url} />
        </Box>
        <Box position="relative" justifySelf="end" mt="8">
          <Box>
            <Tag position="relative" mr="2">
              <FontAwesomeIcon icon={faGripfire} color="orange" />
              <TagLabel ml="1">#12 Top Rated</TagLabel>
            </Tag>
            <Tag position="relative">
              <FontAwesomeIcon icon={faEye} color="grey" />
              <TagLabel ml="1">#3 Most Viewed</TagLabel>
            </Tag>
          </Box>
          <Box my="3">
            <Heading>{anime.title}</Heading>
          </Box>
        </Box>
      </Flex>

      <Box></Box>
    </Box>
  );
};

export default animePage;
