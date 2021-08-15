import PopularRow from "@/components/Home/PopularRow";
import MostWatchedRow from "@/components/Home/MostWatchedRow";
import CurrentlyAiringThisSeason from "@/components/Home/CurrentlyAiringThisSeason";
import CurrentlyAiringContinue from "@/components/Home/CurrentlyAiringContinue";
import { Box } from "@chakra-ui/react";

const Home = () => {
  return (
    <>
      <CurrentlyAiringThisSeason />
      <CurrentlyAiringContinue />
      <PopularRow />
      {/* <MostWatchedRow animes={MostWatchedRowData} /> */}
    </>
  );
};

export default Home;
