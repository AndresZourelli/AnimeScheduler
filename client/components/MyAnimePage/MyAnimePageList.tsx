import AnimeCard from "@/components/Home/AnimeCard";
import {
  useWatchingQuery,
  WatchingStatusEnum,
  useUserWatchingListsQuery,
  UserAnimeList,
  Maybe,
} from "@/graphql";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { Box, Button, Grid, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface MyAnimePageListInterface {
  watchingStatus: WatchingStatusEnum;
}

const MyAnimePageList = ({ watchingStatus }: MyAnimePageListInterface) => {
  const { user } = useAuth();
  const [animesResult, fetchAnimes] = useUserWatchingListsQuery({
    variables: {
      watchingStatus: watchingStatus,
      userId: user.uid,
    },
    requestPolicy: "network-only",
    pause: !user?.uid,
  });
  const [animeLists, setAnimeLists] = useState([]);
  const [hasMoreAnimes, setHasMoreAnimes] = useState(false);

  const [numberOfAnimes, setNumberOfAnimes] = useState(animeLists?.length);
  const [currentAnimesDisplayed, setAnimesDisplayed] = useState(10);

  useEffect(() => {
    if (!animesResult.fetching && animesResult.data?.animeLists) {
      setAnimeLists(animesResult.data.animeLists.nodes);
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
        <Box
          templateColumns="repeat(5, 225px)"
          gridAutoRows="minmax(225px, auto)"
          gap={4}
        >
          {animesResult.data?.animeLists.nodes?.map((list) => {
            return (
              <>
                <Heading w="full">{list.title}</Heading>
                <Grid
                  templateColumns="repeat(5, 225px)"
                  gridAutoRows="minmax(225px, auto)"
                  gap={4}
                >
                  {list.userAnimeLists.nodes.map((anime) => (
                    <AnimeCard
                      key={anime.anime.id + "-" + list.id}
                      url={anime.anime.profileImage.url}
                      id={anime.anime.id}
                      {...anime}
                      userSection
                    />
                  ))}
                </Grid>
              </>
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
