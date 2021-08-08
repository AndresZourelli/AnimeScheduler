import HorizontalScroll from "@/components/Home/HorizontalScroll";
import { Heading, Box } from "@chakra-ui/react";

const PopularRow = ({ animes }) => {
  return (
    <Box>
      <Heading mt="25px" ml="50px">
        Popular Animes
      </Heading>
      <HorizontalScroll animes={animes} />
    </Box>
  );
};

export default PopularRow;
