import { gql, useQuery } from "@apollo/client";
import HorizontalScroll from "@/components/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";

const POPULAR_ANIME_QUERY = gql`
  query GetPopularAnimes($page: Int, $limit: Int) {
    getAnimeHighestRated(page: $page, limit: $limit) {
      animes {
        title
        description
        image_url
        avg_score
      }
      totalPages
      currentPage
    }
  }
`;

const PopularRow = () => {
  const { loading, error, data } = useQuery(POPULAR_ANIME_QUERY);
  const animes = data?.getAnimeHighestRated?.animes;
  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Popular Animes
      </Heading>
      <HorizontalScroll animes={animes} />
    </Box>
  );
};

export default PopularRow;