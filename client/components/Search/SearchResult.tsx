import { Box, Grid, Spinner, Flex } from "@chakra-ui/react";
import { SearchAnimesQuery } from "@/graphql";
import AnimeCard from "@/components/Home/AnimeCard";

type SearchAnime = SearchAnimesQuery["searchAnimes"]["nodes"][0];

interface SearchProps {
  isLoading: boolean;
  searchResult: SearchAnime[];
}

const SearchResult = ({ isLoading, searchResult }: SearchProps) => {
  console.log(isLoading, searchResult);
  return (
    <Box>
      {isLoading && (
        <Flex
          w="full"
          justifyContent="center"
          alignContent="center"
          height="full"
        >
          <Spinner size="xl" />
        </Flex>
      )}

      {!isLoading && (
        <Grid
          templateColumns="repeat(auto-fit, minmax(225px, 225px))"
          gap={6}
          px="48"
        >
          {searchResult?.map((anime) => (
            <AnimeCard key={anime.id} {...anime} />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SearchResult;
