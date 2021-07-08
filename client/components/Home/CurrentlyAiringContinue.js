import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";

const CurrentlyAiringContinue = ({ animes }) => {
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

  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Continuing This Season
      </Heading>
      <HorizontalScroll animes={animes} />
    </Box>
  );
};

export default CurrentlyAiringContinue;
