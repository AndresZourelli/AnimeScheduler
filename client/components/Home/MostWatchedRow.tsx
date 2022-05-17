import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";

const MostWatchedRow = ({ animes, fetching }) => {
  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Most Watched Animes
      </Heading>
      <HorizontalScroll animes={animes} fetching={fetching} />
    </Box>
  );
};

export default MostWatchedRow;
