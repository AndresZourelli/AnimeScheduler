import FullPageSpinner from "@/components/Common/FullPageSpinner";
import { useWeeklyAnimesQuery } from "@/graphql";
import { Box, VStack } from "@chakra-ui/react";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import WeeklyGridColumn from "./WeeklyGridColumn";

const WeeklyGrid = () => {
  const [animeResults, fetchAnimes] = useWeeklyAnimesQuery();
  const animes = animeResults.data?.allAnimesTiles?.nodes;
  const WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [animeWeekday, setAnimeWeekday] = useState([]);

  const addInfo = (obj) => {
    const newObj = obj.map((el) => {
      const timeObj = moment.tz(el.startBroadcastDatetime, moment.tz.guess());
      el.weekday = timeObj.format("e");
      el.formattedAirTime = timeObj.format("HH:mm (z)");
      el.timeAsObject = timeObj.toObject();
      return el;
    });
    setAnimeWeekday(newObj);
  };

  useEffect(() => {
    if (animes) {
      addInfo(animes);
    }
  }, [animes]);

  if (animeResults.fetching && animeResults.data) {
    return <FullPageSpinner />;
  }

  return (
    <Box w="full">
      <VStack spacing={2} w="full">
        {WEEK.map((weekday, i) => {
          return (
            <WeeklyGridColumn
              key={i}
              index={i}
              anime={animeWeekday.filter((animeInfo) => i == animeInfo.weekday)}
            />
          );
        })}
      </VStack>
    </Box>
  );
};

export default WeeklyGrid;
