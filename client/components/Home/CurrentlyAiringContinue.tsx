import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { useCurrentlyAiringContinuedQuery, Season } from "@/graphql";
import { Box, Heading } from "@chakra-ui/react";

const CurrentlyAiringContinue = () => {
  const seasons = {
    1: "Winter",
    2: "Winter",
    3: "Winter",
    4: "Spring",
    5: "Spring",
    6: "Spring",
    7: "Summer",
    8: "Summer",
    9: "Summer",
    10: "Fall",
    11: "Fall",
    12: "Fall",
  };
  const seasonEnum = {
    Winter: Season.Winter,
    Fall: Season.Fall,
    Spring: Season.Spring,
    Summer: Season.Summer,
    Unknown: Season.Unknown,
  };

  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const currentSeason = `${seasons[month]} ${year}`;
  const [currentAiringContResult, queryCurrentAiringCont] =
    useCurrentlyAiringContinuedQuery({
      variables: {
        limit: 30,
        currentSeason: seasonEnum[seasons[month]],
        seasonYear: year,
      },
    });

  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Continuing This Season
      </Heading>
      <HorizontalScroll animes={currentAiringContResult?.data?.animes?.nodes} />
    </Box>
  );
};

export default CurrentlyAiringContinue;
