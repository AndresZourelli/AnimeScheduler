import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { Spinner, Box, Flex } from "@chakra-ui/react";
import AnimePageInfoCol from "@/components/Home/AnimePageInfoCol";
import AnimePageMain from "@/components/Home/AnimePageMain";
import { initializeApollo } from "@/lib/apolloClient";

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
        character
      }
      characters {
        id
        name
        image_url
        role
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

const GET_PATHS = gql`
  query GetPaths {
    getAnimePaths {
      id
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
    variables: { anime_id: id },
  });
  return {
    props: {
      anime: data.getAnime,
    },
  };
};

export default animePage;
