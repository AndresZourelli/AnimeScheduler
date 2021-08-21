import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";
import { useQuery } from "urql";

const CURRENTLY_AIRING_CONTINUED = `
  query CurrentlyAiringContinued($limit: Int!, $currentSeason: String!) {
    allAnimesTiles(
      first: $limit
      filter: {
        airingStatusType: { equalTo: "Currently Airing" }
        and: { season: { notEqualTo: $currentSeason } }
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
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const currentSeason = `${seasons[month]} ${year}`;

  const [currentAiringContResult, queryCurrentAiringCont] = useQuery({
    query: CURRENTLY_AIRING_CONTINUED,
    variables: { limit: 30, currentSeason },
  });
  console.log(currentAiringContResult?.data);
  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Continuing This Season
      </Heading>
      <HorizontalScroll
        animes={currentAiringContResult?.data?.allAnimesTiles?.nodes}
      />
    </Box>
  );
};

export default CurrentlyAiringContinue;
