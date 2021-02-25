import { gql, useQuery } from "@apollo/client";
import HorizontalScroll from "@/components/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";

const CURRENTLY_AIRING_THIS_SEASON_ANIME_QUERY = gql`
  query GetCurrentlyAiring($page: Int, $limit: Int) {
    getCurrentAiringThisSeason(page: $page, limit: $limit) {
      animes {
        title
        description
        image_url
        status
        id: _id
      }
      totalPages
      currentPage
    }
  }
`;

const CurrentlyAiringThisSeason = (props) => {
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
  const { loading, error, data } = useQuery(
    CURRENTLY_AIRING_THIS_SEASON_ANIME_QUERY
  );

  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const animes = data?.getCurrentAiringThisSeason?.animes;
  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Currently Airing {`${seasons[month]} ${year}`}
      </Heading>
      <HorizontalScroll animes={animes} />
    </Box>
  );
};

export default CurrentlyAiringThisSeason;
