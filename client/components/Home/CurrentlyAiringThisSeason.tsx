import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { useCurrentlyAiringQuery, Season } from "@/graphql";
import { Box, Heading } from "@chakra-ui/react";

const CurrentlyAiringThisSeason = () => {
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
  const [currentAiringResult, queryCurrentAiring] = useCurrentlyAiringQuery({
    variables: {
      limit: 30,
      currentSeason: seasonEnum[seasons[month]],
      seasonYear: year,
    },
  });
  return (
    <Box minH="500px">
      <Heading mt="25px" ml="50px">
        Currently Airing {currentSeason}
      </Heading>
      <HorizontalScroll
        animes={currentAiringResult?.data?.animes?.nodes}
        fetching={currentAiringResult.fetching}
      />
    </Box>
  );
};

export default CurrentlyAiringThisSeason;
