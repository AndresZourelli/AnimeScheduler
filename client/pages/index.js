import Nav from "@/components/Nav";
import PopularRow from "@/components/PopularRow";
import MostWatchedRow from "@/components/MostWatchedRow";
import CurrentlyAiringThisSeason from "@/components/CurrentlyAiringThisSeason";
import CurrentlyAiringOutOfSeason from "@/components/CurrentlyAiringOutOfSeason";

export default function Home() {
  return (
    <>
      <Nav />
      <CurrentlyAiringThisSeason />
      <CurrentlyAiringOutOfSeason />
      <PopularRow />
      <MostWatchedRow />
    </>
  );
}
