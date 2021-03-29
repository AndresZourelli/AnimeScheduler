import PopularRow from "@/components/PopularRow";
import MostWatchedRow from "@/components/MostWatchedRow";
import CurrentlyAiringThisSeason from "@/components/CurrentlyAiringThisSeason";
import CurrentlyAiringContinue from "@/components/CurrentlyAiringContinue";
import { gql } from "@apollo/client";
import { initializeApollo } from "@/lib/apolloClient";

const ANIME_QUERIES = gql`
  query GetMostWatchedAnimes($page: Int, $limit: Int) {
    getAnimeMostWatched(page: $page, limit: $limit) {
      animes {
        title
        description
        image_url
        minutes_watched
        id: _id
      }
      totalPages
      currentPage
    }

    getAnimeHighestRated(page: $page, limit: $limit) {
      animes {
        title
        description
        image_url
        avg_score
        id: _id
      }
      totalPages
      currentPage
    }

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

    getCurrentAiringContinue(page: $page, limit: $limit) {
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

const Home = ({
  MostWatchedRowData,
  PopularRowData,
  CurrentlyAiringThisSeasonData,
  CurrentlyAiringContinueData,
}) => {
  return (
    <>
      <CurrentlyAiringThisSeason animes={CurrentlyAiringThisSeasonData} />
      <CurrentlyAiringContinue animes={CurrentlyAiringContinueData} />
      <PopularRow animes={PopularRowData} />
      <MostWatchedRow animes={MostWatchedRowData} />
    </>
  );
};

export const getStaticProps = async () => {
  const client = initializeApollo();
  const { data } = await client.query({ query: ANIME_QUERIES });
  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      MostWatchedRowData: data.getAnimeMostWatched.animes,
      PopularRowData: data.getAnimeHighestRated.animes,
      CurrentlyAiringThisSeasonData: data.getCurrentAiringThisSeason.animes,
      CurrentlyAiringContinueData: data.getCurrentAiringContinue.animes,
    },
  };
};

export default Home;
