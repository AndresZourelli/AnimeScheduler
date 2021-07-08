import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";

const MostWatchedRow = ({ animes }) => {
  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Most Watched Animes
      </Heading>
      <HorizontalScroll animes={animes} />
    </Box>
  );
};

export default MostWatchedRow;
