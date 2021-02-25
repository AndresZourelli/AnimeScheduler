import Nav from "@/components/Nav";
import PopularRow from "@/components/PopularRow";
import MostWatchedRow from "@/components/MostWatchedRow";
import CurrentlyAiringThisSeason from "@/components/CurrentlyAiringThisSeason";
import CurrentlyAiringContinue from "@/components/CurrentlyAiringContinue";

export default function Home() {
  return (
    <>
      <Nav />
      <CurrentlyAiringThisSeason />
      <CurrentlyAiringContinue />
      <PopularRow />
      <MostWatchedRow />
    </>
  );
}
