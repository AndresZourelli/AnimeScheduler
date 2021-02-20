import { gql, useQuery } from "@apollo/client";
import HorizontalScroll from "@/components/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";

const MOST_WATCHED_ANIME_QUERY = gql`
  query GetMostWatchedAnimes($page: Int, $limit: Int) {
    getAnimeMostWatched(page: $page, limit: $limit) {
      animes {
        title
        description
        image_url
        minutes_watched
      }
      totalPages
      currentPage
    }
  }
`;

const MostWatchedRow = () => {
  const { loading, error, data } = useQuery(MOST_WATCHED_ANIME_QUERY);
  const animes = data?.getAnimeMostWatched?.animes;
  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Most Watched Animes
      </Heading>
      <HorizontalScroll animes={animes} />
    </Box>
  );
};

export default MostWatchedRow;
