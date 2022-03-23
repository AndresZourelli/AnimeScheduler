import { useState } from "react";
import {
  Box,
  Heading,
  Stack,
  Grid,
  GridItem,
  Text,
  Tag,
  Select,
  Flex,
} from "@chakra-ui/react";
import { useWeeklyAnimesQuery, WeeklyAnimesQuery } from "@/graphql";
import {
  getDay,
  format,
  setHours,
  setMinutes,
  setSeconds,
  set,
  getHours,
  getMinutes,
  getSeconds,
  getDate,
  setDay,
  compareAsc,
} from "date-fns";
import AnimeCard from "@/components/Home/AnimeCard";

type Anime = WeeklyAnimesQuery["animes"]["nodes"][0];

const Weekly = () => {
  const [filterByUserAnimes, setFilterByUserAnimes] = useState(false);
  const [animeResults, fetchAnimes] = useWeeklyAnimesQuery({
    variables: { isNull: filterByUserAnimes },
  });
  const animeSortedByWeekday = sortToWeekday(
    animeResults.data?.animes.nodes ?? []
  );

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterByUserAnimes(e.target.value ? null : false);
  };

  return (
    <Box px="20" py="10">
      <Flex float="right" w="15%" alignItems="center">
        Show:
        <Select onChange={onSelectChange} ml="2">
          <option value={1}>All Animes</option>
          <option value={0}>My Animes</option>
        </Select>
      </Flex>
      <Stack spacing="10">
        {weekdayArrayMap.map((weekday, index) => {
          return (
            <Box key={weekday + "-" + index}>
              <Heading>{weekday}</Heading>
              <Grid autoColumns={"auto"}>
                {animeSortedByWeekday[index].length > 0 ? (
                  animeSortedByWeekday[index]
                    .sort((a, b) =>
                      compareAsc(
                        convertDateToHours(a.startBroadcastDatetime),
                        convertDateToHours(b.startBroadcastDatetime)
                      )
                    )
                    .map((anime) => {
                      const date = new Date(anime.startBroadcastDatetime);

                      const todayDate = set(setDay(new Date(), index), {
                        hours: getHours(date),
                        minutes: getMinutes(date),
                        seconds: getSeconds(date),
                      });
                      return (
                        <GridItem key={anime.id} position="relative">
                          <AnimeCard
                            {...anime}
                            airingTime={format(todayDate, "EEE, LLL d HH:mm")}
                          />

                          <Text>{}</Text>
                        </GridItem>
                      );
                    })
                ) : (
                  <Box>No New Animes</Box>
                )}
              </Grid>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

interface WeekdayAnime {
  sunday: Anime[];
  monday: Anime[];
  tuesday: Anime[];
  wednesday: Anime[];
  thursday: Anime[];
  friday: Anime[];
  saturday: Anime[];
}
const weekdayArrayMap = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const sortToWeekday = (nodes: Anime[]): Anime[][] => {
  const weekdayArray: Anime[][] = [[], [], [], [], [], [], []];
  const weekdayAnimeArray: WeekdayAnime = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  };

  nodes.map((anime) => {
    const day = new Date(anime.startBroadcastDatetime);
    const dayIndex = getDay(day);
    weekdayArray[dayIndex].push(anime);
  });

  return weekdayArray;
};

const convertDateToHours = (time: string): Date => {
  let obj = new Date();
  let currentTime = new Date(time);
  let timeObj = {
    hours: getHours(currentTime),
    minutes: getMinutes(currentTime),
    seconds: getSeconds(currentTime),
  };
  setHours(obj, timeObj.hours);
  setMinutes(obj, timeObj.minutes);
  setSeconds(obj, timeObj.seconds);
  return obj;
};

export default Weekly;
