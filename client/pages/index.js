import Nav from "@/components/Nav";
import PopularRow from "@/components/PopularRow";
import MostWatchedRow from "@/components/MostWatchedRow";
import CurrentlyAiring from "@/components/CurrentlyAiring";

export default function Home() {
  return (
    <>
      <Nav />
      <CurrentlyAiring />
      <PopularRow />
      <MostWatchedRow />
    </>
  );
}
