import { Box, Grid, VStack } from "@chakra-ui/react";
import WeeklyGridColumn from "./WeeklyGridColumn";
import moment from "moment-timezone";
import { useState, useEffect } from "react";
import { useQuery } from "urql";
import FullPageSpinner from "@/components/Common/FullPageSpinner";

const WEEKLY_ANIMES = `
query WeeklyAnimes {
  allAnimesTiles(filter: {airingStatusType: {equalTo: "Currently Airing"}}) {
      nodes {
        id
        title
        season
        airingStatusType
        averageWatcherRating
        startBroadcastDatetime
        url
        description
        genres
        mediaType
        numberOfEpisodes
        studios
        likes
      }
    }
}
`;
const WeeklyGrid = () => {
  const [animeResults, fetchAnimes] = useQuery({ query: WEEKLY_ANIMES });
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
