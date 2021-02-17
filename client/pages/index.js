import { gql, useQuery } from "@apollo/client";
import Nav from "@/components/Nav";
import AnimeCard from "@/components/AnimeCard";
import { Flex, SimpleGrid, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

export const ALL_ANIME_QUERY = gql`
  query {
    getAnimes {
      animes {
        title
        description
        image_url
        avg_score
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(ALL_ANIME_QUERY);
  const animes = data?.getAnimes?.animes;

  let listAnimes = animes?.map((anime) => {
    return (
      <AnimeCard
        title={anime.title}
        image_url={anime.image_url}
        score={anime.avg_score}
        key={uuidv4()}
      />
    );
  });

  const isLoading = (
    <Flex justify="center">
      <Spinner size="xl" />
    </Flex>
  );
  return (
    <>
      <Nav />
      <SimpleGrid
        minChildWidth="200px"
        spacing="5px"
        justifyItems="center"
        mx="15rem"
        mt="4rem">
        {loading ? isLoading : listAnimes}
      </SimpleGrid>
    </>
  );
}
