import AnimeCard from "@/components/Home/AnimeCard";
import {
  StringFilter,
  useWeeklyAnimesQuery,
  WeeklyAnimesQuery,
} from "@/graphql";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Select,
  Stack,
} from "@chakra-ui/react";
import {
  compareAsc,
  format,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
  set,
  setDay,
} from "date-fns";
import { useState } from "react";

type Anime = WeeklyAnimesQuery["animes"]["nodes"][0];

const enum AnimeDropdown {
  ShowAllAnime,
  ShowMyAnime,
}

const Weekly = () => {
  const [filterByUserAnimes, setFilterByUserAnimes] =
    useState<StringFilter | null>(null);
  const [animeResults, fetchAnimes] = useWeeklyAnimesQuery({
    variables: { userWatchStatus: filterByUserAnimes },
  });
  const animeSortedByWeekday = sortToWeekday(
    animeResults.data?.animes.nodes ?? []
  );

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (Number(e.target.value) === AnimeDropdown.ShowAllAnime) {
      setFilterByUserAnimes(null);
    } else {
      setFilterByUserAnimes({ isNull: false });
    }
  };

  return (
    <Box px="20" py="10">
      <Flex float="right" w="15%" alignItems="center">
        Show:
        <Select onChange={onSelectChange} ml="2">
          <option value={AnimeDropdown.ShowAllAnime}>All Animes</option>
          <option value={AnimeDropdown.ShowMyAnime}>My Animes</option>
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
                        </GridItem>
                      );
                    })
                ) : (
                  <Box h="395px">No New Animes</Box>
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
  let currentTime = new Date(time);

  let finalTime = set(new Date(), {
    hours: getHours(currentTime),
    minutes: getMinutes(currentTime),
    seconds: getSeconds(currentTime),
  });

  return finalTime;
};

export default Weekly;
