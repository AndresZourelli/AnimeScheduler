import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { Box, Heading, Flex, Button } from "@chakra-ui/react";
import AnimeCard from "./AnimeCard";

const MyAnimePageList = ({ animes }) => {
  const [hasMoreAnimes, setHasMoreAnimes] = useState(false);

  const [numberOfAnimes, setNumberOfAnimes] = useState(animes.length);
  const [currentAnimesDisplayed, setAnimesDisplayed] = useState(10);

  useEffect(() => {
    if (currentAnimesDisplayed < numberOfAnimes) {
      setHasMoreAnimes(true);
    } else {
      setHasMoreAnimes(false);
    }
  }, [currentAnimesDisplayed]);

  const animesShowMore = () => {
    setAnimesDisplayed((prevState) => prevState + 10);
  };

  return (
    <Box position="relative" justifySelf="end" mt="8">
      <Box my="3" mr="16">
        <Heading mb="3">My Animes</Heading>
        <Flex wrap="wrap" justifyContent="flexStart">
          {animes.slice(0, currentAnimesDisplayed).map((anime) => {
            return <AnimeCard key={anime.id} {...anime}></AnimeCard>;
          })}
        </Flex>
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
