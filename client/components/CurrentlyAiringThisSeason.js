import HorizontalScroll from "@/components/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";

const CurrentlyAiringThisSeason = ({ animes }) => {
  const seasons = {
    1: "Winter",
    2: "Winter",
    3: "Winter",
    4: "Spring",
    5: "Spring",
    6: "Spring",
    7: "Summer",
    8: "Summer",
    9: "Summer",
    10: "Fall",
    11: "Fall",
    12: "Fall",
  };

  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Currently Airing {`${seasons[month]} ${year}`}
      </Heading>
      <HorizontalScroll animes={animes} />
    </Box>
  );
};

export default CurrentlyAiringThisSeason;
