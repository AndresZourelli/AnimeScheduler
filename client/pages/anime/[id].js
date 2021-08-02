import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { Spinner, Box, Flex } from "@chakra-ui/react";
import AnimePageInfoCol from "@/components/Home/AnimePageInfoCol";
import AnimePageMain from "@/components/Home/AnimePageMain";
import { initializeApollo } from "@/lib/apolloClient";

const GET_ANIME = gql`
  query GetAnime($animeId: ID!) {
    getAnime(animeId: $animeId) {
      id
      title
      average_watcher_rating
      description
      profile_image
      number_of_episodes
      start_broadcast_datetime
      end_broadcast_datetime
      broadcast_day
      broadcast_time
      duration
      media_type
      season
      source_material_type
      airing_status_type
      rating
      genres {
        id
        genre
      }
      licensors {
        id
        licensor
      }
      producers {
        id
        producer
      }
      studios {
        id
        studio
      }
      alt_names {
        name
      }
      minutes_watched
      actors {
        id
        actor_name
        person_image
        language
        character
      }
      characters {
        id
        name
        character_image
        role
      }
      staff {
        id
        staff_name
        person_image
        role
      }
    }
  }
`;

const GET_PATHS = gql`
  query GetPaths {
    getAnimePaths {
      id
    }
  }
`;

const AnimePage = ({ anime }) => {
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
    query: GET_ANIME,
    variables: { animeId: id },
  });

  return {
    props: {
      anime: data.getAnime,
    },
  };
};

export default AnimePage;
