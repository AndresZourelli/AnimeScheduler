import PopularRow from "@/components/Home/PopularRow";
import MostWatchedRow from "@/components/Home/MostWatchedRow";
import CurrentlyAiringThisSeason from "@/components/Home/CurrentlyAiringThisSeason";
import CurrentlyAiringContinue from "@/components/Home/CurrentlyAiringContinue";
import { gql } from "@apollo/client";
import { initializeApollo } from "@/lib/apolloClient";

const ANIME_QUERIES = gql`
  query GetMostWatchedAnimes($page: Int, $limit: Int) {
    getAnimeMostWatched(page: $page, limit: $limit) {
      animes {
        anime_title
        anime_description
        primary_image_url
        minutes_watched
        average_rating
        anime_id
      }
      totalPages
      currentPage
    }

    getAnimeHighestRated(page: $page, limit: $limit) {
      animes {
        anime_title
        anime_description
        primary_image_url
        average_rating
        anime_id
      }
      totalPages
      currentPage
    }

    getCurrentAiringThisSeason(page: $page, limit: $limit) {
      animes {
        anime_title
        anime_description
        primary_image_url
        airing_status_type_name
        average_rating
        anime_id
      }
      totalPages
      currentPage
    }

    getCurrentAiringContinue(page: $page, limit: $limit) {
      animes {
        anime_title
        anime_description
        primary_image_url
        airing_status_type_name
        average_rating
        anime_id
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
      {/* <MostWatchedRow animes={MostWatchedRowData} /> */}
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
