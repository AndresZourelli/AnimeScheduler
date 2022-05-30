import AnimeCard from "@/components/Home/AnimeCard";
import {
  useGetUserAnimeListsQuery,
  WatchStatusTypes,
  useUserCustomAnimeListByWatchStatusQuery,
} from "@/graphql";
import { useAuth } from "@/lib/Auth/Auth";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface MyAnimePageListInterface {
  watchingStatus: WatchStatusTypes;
}

const MyAnimePageList = ({ watchingStatus }: MyAnimePageListInterface) => {
  const { user } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [animesResult, fetchAnimes] = useUserCustomAnimeListByWatchStatusQuery({
    variables: { watchStatusType: watchingStatus },
    pause: !user?.userId,
  });

  const [animeLists, setAnimeLists] = useState([]);
  const [hasMoreAnimes, setHasMoreAnimes] = useState(false);

  const [numberOfAnimes, setNumberOfAnimes] = useState(animeLists?.length);
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

  useEffect(() => {
    if (
      !animesResult.fetching &&
      animesResult.data &&
      animesResult.data.animes?.nodes &&
      !dataLoaded
    ) {
      setAnimeLists([...animesResult.data.animes?.nodes, ...animeLists]);
      setDataLoaded(true);
    }
  }, [animesResult, animeLists, dataLoaded]);

  if (animesResult.fetching) {
    return (
      <Flex w="full" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box position="relative" justifySelf="end" mt="8" mx="3">
      <Grid templateColumns={"repeat(auto-fit, minmax(225px, 225px))"} gap={3}>
        {animesResult.data?.animes?.nodes
          .filter((node) => node.userWatchStatus === watchingStatus)
          .map((anime, idx) => (
            <AnimeCard key={anime.id} {...anime} />
          ))}
      </Grid>
      <Box display="flex">
        {hasMoreAnimes ? (
          <Button m="auto" onClick={animesShowMore} size="sm">
            Show More
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export default MyAnimePageList;
