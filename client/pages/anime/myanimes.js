import WeeklyGrid from "@/components/WeeklyGrid";
import { Box, Heading } from "@chakra-ui/react";

const MyAnimes = () => {
  return (
    <Box m={5}>
      <Heading>My Animes Page</Heading>
      <Box>
        <WeeklyGrid></WeeklyGrid>
      </Box>
    </Box>
  );
};

export default MyAnimes;
