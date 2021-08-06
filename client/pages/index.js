import PopularRow from "@/components/Home/PopularRow";
import MostWatchedRow from "@/components/Home/MostWatchedRow";
import CurrentlyAiringThisSeason from "@/components/Home/CurrentlyAiringThisSeason";
import CurrentlyAiringContinue from "@/components/Home/CurrentlyAiringContinue";
import { gql } from "@apollo/client";
import { initializeApollo } from "@/lib/apolloClient";
import { Box } from "@chakra-ui/react";

const ANIME_QUERIES = gql`
  query GetMostWatchedAnimes($page: Int, $limit: Int) {
    getAnimeMostWatched(page: $page, limit: $limit) {
      animes {
        title
        description
        url
        minutes_watched
        average_watcher_rating
        id
      }
      totalPages
      currentPage
    }

    getAnimeHighestRated(page: $page, limit: $limit) {
      animes {
        title
        description
        url
        average_watcher_rating
        id
      }
      totalPages
      currentPage
    }

    getCurrentAiringThisSeason(page: $page, limit: $limit) {
      animes {
        title
        description
        url
        airing_status_type
        average_watcher_rating
        id
      }
      totalPages
      currentPage
    }

    getCurrentAiringContinue(page: $page, limit: $limit) {
      animes {
        title
        description
        url
        airing_status_type
        average_watcher_rating
        id
      }
      totalPages
      currentPage
    }
  }
`;

const Home = (
  {
    // MostWatchedRowData,
    // PopularRowData,
    // CurrentlyAiringThisSeasonData,
    // CurrentlyAiringContinueData,
  }
) => {
  return (
    <>
      <Box>Hello</Box>
      {/* <CurrentlyAiringThisSeason animes={CurrentlyAiringThisSeasonData} />
      <CurrentlyAiringContinue animes={CurrentlyAiringContinueData} />
      <PopularRow animes={PopularRowData} /> */}
      {/* <MostWatchedRow animes={MostWatchedRowData} /> */}
    </>
  );
};

// export const getStaticProps = async () => {
//   const client = initializeApollo();
//   const { data } = await client.query({ query: ANIME_QUERIES });
//   if (!data) {
//     return {
//       notFound: true,
//     };
//   }
//   return {
//     props: {
//       MostWatchedRowData: data.getAnimeMostWatched.animes,
//       PopularRowData: data.getAnimeHighestRated.animes,
//       CurrentlyAiringThisSeasonData: data.getCurrentAiringThisSeason.animes,
//       CurrentlyAiringContinueData: data.getCurrentAiringContinue.animes,
//     },
//   };
// };

export default Home;
