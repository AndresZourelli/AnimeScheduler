import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { useHighestRatedAnimesQuery } from "@/graphql";
import { Box, Heading } from "@chakra-ui/react";

const PopularRow = () => {
  const [highestRatedResult, queryHighestRated] = useHighestRatedAnimesQuery({
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
