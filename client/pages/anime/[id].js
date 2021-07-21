import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { Spinner, Box, Flex } from "@chakra-ui/react";
import AnimePageInfoCol from "@/components/Home/AnimePageInfoCol";
import AnimePageMain from "@/components/Home/AnimePageMain";
import { initializeApollo } from "@/lib/apolloClient";

const GET_ANIME = gql`
  query GetAnime($anime_id: ID!) {
    getAnime(anime_id: $anime_id) {
      anime_id
      anime_title
      avg_score
      anime_description
      primary_image_url
      number_of_episodes
      start_broadcast_datetime
      end_broadcast_datetime
      broadcast_day
      broadcast_time
      duration
      type
      season
      source
      status
      rating
      genres{
        genre_id
        genre_name
      }
      licensors{
        licensor_id
        licensor_name
      }
      producers{
        producer_id
        producer_name
      }
      studios{
        studio_id
        studio_name
      }
      alt_names {
        Japanese
        English
        Synonyms
      }
      minutes_watched
      actors {
        actor_id
        actor_name
        image_url
        actor_language
        character
      }
      characters {
        character_id
        character_name
        image_url
        role
      }
      staff {
        staff_id
        staff_name
        image_url
        role
      }
    }
  }
`;

const GET_PATHS = gql`
  query GetPaths {
    getAnimePaths {
      anime_id
    }
  }
`;

const animePage = ({ anime }) => {
  const router = useRouter();
  const { id } = router.query;

  const tagColors = [
    "gray",
    "blue",
    "cyan",
    "green",
    "orange",
    "pink",
    "purple",
    "red",
    "teal",
    "yellow",
  ];

  if (!id || !anime) {
    return (
      <Box>
        <Spinner size="xl" display="block" m="auto" my="10" />
      </Box>
    );
  }

  return (
    <Box position="relative">
      <Flex position="relative">
        <AnimePageInfoCol {...anime} />
        <AnimePageMain {...anime} />
      </Flex>
    </Box>
  );
};

export const getStaticPaths = async () => {
  const client = initializeApollo();
  const { data } = await client.query({ query: GET_PATHS });
  let formatedData = data?.getAnimePaths?.map((item) => ({
    params: {
      id: item.anime_id,
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
    query: GET_ANIME,
    variables: { anime_id: id },
  });

  return {
    props: {
      anime: data.getAnime,
    },
  };
};

export default animePage;
