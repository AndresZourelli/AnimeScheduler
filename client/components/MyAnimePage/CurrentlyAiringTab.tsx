import FullPageSpinner from "@/components/Common/FullPageSpinner";
import { useWeeklyAnimesQuery } from "@/graphql";
import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import {
  compareAsc,
  compareDesc,
  format,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
  set,
  setDay,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import AnimeCard from "../Home/AnimeCard";

const CurrentlyAiringTab = () => {
  const [animeResults, fetchAnimes] = useWeeklyAnimesQuery();
  const animes = animeResults.data?.animes?.nodes;

  if (animeResults.fetching && animeResults.data) {
    return <FullPageSpinner />;
  }

  return (
    <Box m={5}>
      <Heading>Currently Airing</Heading>
      <Grid
        templateColumns="repeat(auto-fit, minmax(225px, 225px))"
        gap="3"
        mt="8"
        mx="3"
      >
        {animes
          ?.sort((a, b) => {
            return compareAsc(
              convertDateToHours(a.startBroadcastDatetime),
              convertDateToHours(b.startBroadcastDatetime)
            );
          })
          .map((anime) => {
            const date = new Date(anime.startBroadcastDatetime);

            const todayDate = set(setDay(new Date(), getDay(date)), {
              hours: getHours(date),
              minutes: getMinutes(date),
              seconds: getSeconds(date),
            });
            return (
              <GridItem key={anime.id} position="relative">
                <AnimeCard
                  {...anime}
                  airingTime={format(todayDate, "EEE, LLL d HH:mm")}
                  countDown={true}
                />
              </GridItem>
            );
          })}
      </Grid>
    </Box>
  );
};

const convertDateToHours = (time: string): Date => {
  let obj = new Date();
  let currentTime = new Date(time);
  let newTime = set(obj, {
    hours: getHours(currentTime),
    minutes: getMinutes(currentTime),
    seconds: getSeconds(currentTime),
  });
  let finalTime = setDay(newTime, getDay(currentTime));

  return finalTime;
};

export default CurrentlyAiringTab;
