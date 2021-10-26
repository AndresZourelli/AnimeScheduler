import AnimeCard from "@/components/Home/AnimeCard";
import { useGetUserAnimeListsQuery, WatchingStatusEnum } from "@/graphql";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { Box, Button, Grid, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface MyAnimePageListInterface {
  watchingStatus: WatchingStatusEnum;
}

const MyAnimePageList = ({ watchingStatus }: MyAnimePageListInterface) => {
  const { user } = useAuth();
  const [animesResult, fetchAnimes] = useGetUserAnimeListsQuery({
    variables: { watchStatus: watchingStatus },
    pause: !user?.uid,
  });
  const [animeLists, setAnimeLists] = useState([]);
  const [hasMoreAnimes, setHasMoreAnimes] = useState(false);

  const [numberOfAnimes, setNumberOfAnimes] = useState(animeLists?.length);
  const [currentAnimesDisplayed, setAnimesDisplayed] = useState(10);

  // useEffect(() => {
  //   if (!animesResult.fetching && animesResult.data?.getUserAnimeLists) {
  //     setAnimeLists(animesResult.data.getUserAnimeLists.nodes);
  //   }
  // }, [animesResult]);

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

  useEffect(() => {
    if (
      !animesResult.fetching &&
      animesResult.data &&
      animesResult.data.getUserAnimeLists?.nodes
    ) {
      setAnimeLists([
        ...animesResult.data.getUserAnimeLists?.nodes,
        ...animeLists,
      ]);
    }
  }, [animesResult, animeLists]);

  return (
    <Box position="relative" justifySelf="end" mt="8" mx="3">
      <Box my="3" mr="16">
        <Box
          gridTemplateColumns="repeat(5, 225px)"
          gridAutoRows="minmax(225px, auto)"
          gap={4}
        >
          {animesResult.data?.getUserAnimeLists?.nodes.map((list, idx) => {
            const test = list.animes.map((anime, idx2) => (
              <AnimeCard
                key={anime.id + "-" + list.id}
                url={anime.url}
                id={anime.id}
                {...anime}
                userSection
              />
            ));
            return (
              <Box key={list.id}>
                <Heading w="full">{list.title}</Heading>

                <Grid
                  gridTemplateColumns="repeat(5, 225px)"
                  gridAutoRows="minmax(225px, auto)"
                  gap={4}
                >
                  {test}
                </Grid>
              </Box>
            );
          })}
        </Box>
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