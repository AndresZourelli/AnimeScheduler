import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { useHighestRatedAnimesQuery } from "@/graphql";
import { Box, Heading, Skeleton, SkeletonText } from "@chakra-ui/react";

const PopularRow = () => {
  const [highestRatedResult, queryHighestRated] = useHighestRatedAnimesQuery({
    variables: { limit: 30 },
  });
  console.log(highestRatedResult);
  return (
    <Box minH="500px">
      <Heading mt="25px" ml="50px">
        Popular Animes
      </Heading>
      <HorizontalScroll
        animes={highestRatedResult?.data?.animes?.nodes}
        fetching={highestRatedResult.fetching}
      />
    </Box>
  );
};

export default PopularRow;
