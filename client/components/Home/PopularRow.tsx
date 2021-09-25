import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";
import { useQuery } from "urql";

const HIGHEST_RATED_ANIMES = `
  query HighestRatedAnimes($limit: Int!) {
    allAnimesTiles(first: $limit) {
      nodes {
        id
        title
        url
        season
        averageWatcherRating
        airingStatusType
        likes
      }
    }
  }
`;

const PopularRow = () => {
  const [highestRatedResult, queryHighestRated] = useQuery({
    query: HIGHEST_RATED_ANIMES,
    variables: { limit: 30 },
  });

  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Popular Animes
      </Heading>
      <HorizontalScroll
        animes={highestRatedResult?.data?.allAnimesTiles?.nodes}
      />
    </Box>
  );
};

export default PopularRow;
