import CurrentlyAiringContinue from "@/components/Home/CurrentlyAiringContinue";
import CurrentlyAiringThisSeason from "@/components/Home/CurrentlyAiringThisSeason";
import PopularRow from "@/components/Home/PopularRow";

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
