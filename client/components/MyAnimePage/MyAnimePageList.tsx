import AnimeCard from "@/components/Home/AnimeCard";
import {
  useWatchingQuery,
  WatchingStatusEnum,
  useUserWatchingListsQuery,
  UserAnimeList,
  Maybe,
} from "@/graphql";
import { Box, Button, Grid, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface MyAnimePageListInterface {
  watchingStatus: WatchingStatusEnum;
}

const MyAnimePageList = ({ watchingStatus }: MyAnimePageListInterface) => {
  const [animesResult, fetchAnimes] = useUserWatchingListsQuery({
    variables: {
      watchingStatus: watchingStatus,
    },
    requestPolicy: "network-only",
  });
  console.log(animesResult.data?.userAnimeLists.nodes);
  const [animeLists, setAnimeLists] = useState([]);
  const [hasMoreAnimes, setHasMoreAnimes] = useState(false);

  const [numberOfAnimes, setNumberOfAnimes] = useState(animeLists?.length);
  const [currentAnimesDisplayed, setAnimesDisplayed] = useState(10);

  useEffect(() => {
    if (!animesResult.fetching && animesResult.data?.userAnimeLists) {
      setAnimeLists(animesResult.data.userAnimeLists.nodes);
    }
  }, [animesResult]);

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
    <Box position="relative" justifySelf="end" mt="8" mx="3">
      <Box my="3" mr="16">
        <Grid
          templateColumns="repeat(5, 225px)"
          gridAutoRows="minmax(225px, auto)"
          gap={4}
        >
          {animesResult.data?.userAnimeLists.nodes?.map((list) => {
            return (
              <>
                <Heading>{list}</Heading>
                {list.animeList.userAnimeLists.nodes.map((anime) => (
                  <AnimeCard
                    key={anime.anime.id + "-" + anime.listId}
                    url={anime.url}
                    {...anime}
                    userSection
                  />
                ))}
              </>
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
