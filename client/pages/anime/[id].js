import Nav from "@/components/Nav";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { Spinner, Box, Flex } from "@chakra-ui/react";
import AnimePageInfoCol from "@/components/AnimePageInfoCol";
import AnimePageMain from "@/components/AnimePageMain";

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
      actors {
        id
        name
        image_url
        actor_language
      }
      characters {
        id
        name
        image_url
        role
        actor
      }
      staff {
        id
        name
        image_url
        role
      }
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

  const anime = data?.getAnime;

  if (!id || !anime || loading) {
    return (
      <Box>
        <Nav />
        <Spinner size="xl" display="block" m="auto" my="10"></Spinner>
      </Box>
    );
  }

  return (
    <Box position="relative">
      <Nav />
      <Flex position="relative">
        <AnimePageInfoCol {...anime} loading={loading} />
        <AnimePageMain {...anime} loading={loading} />
      </Flex>
    </Box>
  );
};

export default animePage;
