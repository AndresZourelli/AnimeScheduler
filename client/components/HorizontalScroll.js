import { HStack } from "@chakra-ui/react";
import AnimeCard from "@/components/AnimeCard";
import { v4 as uuidv4 } from "uuid";

const HorizontalScroll = ({ animes }) => {
  const display = animes?.map((anime) => {
    return (
      <AnimeCard
        title={anime.title}
        image_url={anime.image_url}
        score={anime.avg_score}
        key={uuidv4()}
      />
    );
  });
  return (
    <>
      <HStack spacing="15px" overflow="scroll">
        {display}
      </HStack>
    </>
  );
};

export default HorizontalScroll;
