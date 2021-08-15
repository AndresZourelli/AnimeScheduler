import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";
import { useQuery } from "urql";

const CURRENTLY_AIRING = `
  query CurrentlyAiring($limit: Int!, $currentSeason: String!) {
    allAnimesTiles(
      first: $limit
      filter: {
        airingStatusType: { equalTo: "Currently Airing" }
        and: { season: { equalTo: $currentSeason } }
      }
    ) {
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

  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const currentSeason = `${seasons[month]} ${year}`;

  const [currentAiringResult, queryCurrentAiring] = useQuery({
    query: CURRENTLY_AIRING,
    variables: {
      limit: 30,
      currentSeason,
    },
  });

  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Currently Airing {currentSeason}
      </Heading>
      <HorizontalScroll
        animes={currentAiringResult?.data?.allAnimesTiles?.nodes}
      />
    </Box>
  );
};

export default CurrentlyAiringThisSeason;
