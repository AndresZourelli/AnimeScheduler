import { gql, useQuery } from "@apollo/client";
import HorizontalScroll from "@/components/HorizontalScroll";

const POPULAR_ANIME_QUERY = gql`
  query GetPopularAnimes($page: Int, $limit: Int) {
    getAnimeHighestRated(page: $page, limit: $limit) {
      animes {
        title
        description
        image_url
        avg_score
      }
      totalPages
      currentPage
    }
  }
`;

const PopularRow = () => {
  const { loading, error, data } = useQuery(POPULAR_ANIME_QUERY);
  const animes = data?.getAnimeHighestRated?.animes;
  return (
    <div>
      <HorizontalScroll animes={animes} />
    </div>
  );
};

export default PopularRow;
