import { GridItem, Heading } from "@chakra-ui/react";
import WeeklyGridCard from "@/components/WeeklyGridCard";
import moment from "moment";

const WeeklyGridColumn = ({ index, anime, deleteAnime }) => {
  const timeObject = moment();
  const getWeekDay = (intDay) => {
    return timeObject.weekday(intDay).format("dddd MMM D");
  };

  anime.sort(function (a, b) {
    const aFloatHours = a.timeAsObject.hours + a.timeAsObject.minutes / 60;
    const bFloatHours = b.timeAsObject.hours + b.timeAsObject.minutes / 60;
    return aFloatHours - bFloatHours;
  });

  return (
    <GridItem key={index} textAlign="center" bg="brown" p={4}>
      <Heading>{getWeekDay(index)}</Heading>
      {anime?.map((animeDay, j) => {
        return (
          <WeeklyGridCard
            key={j}
            {...animeDay}
            index={j}
            deleteAnime={deleteAnime}
          />
        );
      })}
    </GridItem>
  );
};

export default WeeklyGridColumn;
