import AnimeCard from "@/components/Home/AnimeCard";
import { Box, Button, Flex, Grid, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const MyAnimePageList = ({ animes }) => {
  const [hasMoreAnimes, setHasMoreAnimes] = useState(false);

  const [numberOfAnimes, setNumberOfAnimes] = useState(animes?.length);
  const [currentAnimesDisplayed, setAnimesDisplayed] = useState(10);

  useEffect(() => {
    if (currentAnimesDisplayed < numberOfAnimes) {
      setHasMoreAnimes(true);
    } else {
      setHasMoreAnimes(false);
    }
  }, [currentAnimesDisplayed, numberOfAnimes]);

  const animesShowMore = () => {
    setAnimesDisplayed((prevState) => prevState + 10);
  };

  return (
    <Box position="relative" justifySelf="end" mt="8">
      <Box my="3" mr="16">
        <Heading mb="3">My Animes</Heading>
        <Grid
          templateColumns="repeat(5, 225px)"
          gridAutoRows="minmax(225px, auto)"
          gap={4}
        >
          {animes?.map((anime) => {
            return (
              <AnimeCard
                key={anime.anime.id}
                url={anime.anime.profileImage.url}
                {...anime.anime}
              />
            );
          })}
        </Grid>
        <Box display="flex">
          {hasMoreAnimes ? (
            <Button m="auto" onClick={animesShowMore} size="sm">
              Show More
            </Button>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default MyAnimePageList;
