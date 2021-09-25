import { GridItem, Heading, Box } from "@chakra-ui/react";
import WeeklyGridCard from "@/components/MyAnimePage/WeeklyGridCard";
import moment from "moment";

const WeeklyGridColumn = ({ index, anime }) => {
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
    <Box
      key={index}
      textAlign="center"
      bg="brown"
      p={4}
      width="full"
      minHeight="lg"
    >
      <Heading>{getWeekDay(index)}</Heading>
      {anime?.map((animeDay, j) => {
        return <WeeklyGridCard key={j} {...animeDay} index={j} />;
      })}
    </Box>
  );
};

export default WeeklyGridColumn;
