import { Box, Grid } from "@chakra-ui/react";
import WeeklyGridColumn from "./WeeklyGridColumn";
import moment from "moment";
import { useState, useEffect } from "react";

const WeeklyGrid = () => {
  //TODO: add api call
  const animes = [
    {
      id: "6020b9c92b08da8ba5aa755e",
      title: "Fullmetal Alchemist: Brotherhood",
      image_url: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
      aired_start: "1238947200000",
    },
    {
      id: "6020b9c92b08da8ba5aa756f",
      title: "Steins;Gate",
      image_url: "https://cdn.myanimelist.net/images/anime/5/73199.jpg",
      aired_start: "1302023100000",
    },
    {
      id: "6020b9c92b08da8ba5aa7573",
      title: "Gintama°",
      image_url: "https://cdn.myanimelist.net/images/anime/3/72078.jpg",
      aired_start: "1428483600000",
    },
    {
      id: "6020b9c92b08da8ba5aa757c",
      title: "Hunter x Hunter (2011)",
      image_url: "https://cdn.myanimelist.net/images/anime/11/33657.jpg",
      aired_start: "1317520500000",
    },
    {
      id: "6020b9c92b08da8ba5aa7583",
      title: "Shingeki no Kyojin Season 3 Part 2",
      image_url: "https://cdn.myanimelist.net/images/anime/1517/100633.jpg",
      aired_start: "1556464200000",
    },
  ];

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
      const timeObj = moment.utc(parseInt(el.aired_start));
      timeObj.local();
      el.weekday = timeObj.format("e");
      el.formattedAirTime = timeObj.format("LLLL");
      el.timeAsObject = timeObj.toObject();
      return el;
    });
    setAnimeWeekday(newObj);
  };

  const deleteAnime = (id) => {
    const filteredList = animeWeekday.filter((anime) => anime.id !== id);
    setAnimeWeekday(filteredList);
  };

  useEffect(() => {
    addInfo(animes);
  }, []);

  return (
    <Box>
      <Box />
      <Grid
        templateColumns="repeat(auto-fill, minmax(375px, 1fr))"
        gridAutoRows="minmax(250px, 1fr)"
        gap={2}
        m={3}
      >
        {WEEK.map((weekday, i) => {
          return (
            <WeeklyGridColumn
              key={i}
              index={i}
              anime={animeWeekday.filter((animeInfo) => i == animeInfo.weekday)}
              deleteAnime={deleteAnime}
             />
          );
        })}
      </Grid>
    </Box>
  );
};

export default WeeklyGrid;
