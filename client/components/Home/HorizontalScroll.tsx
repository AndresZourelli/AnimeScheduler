import { HStack, Box, Heading } from "@chakra-ui/react";
import AnimeCard from "@/components/Home/AnimeCard";
import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  AiringStatusTypes,
  CurrentlyAiringContinuedQuery,
  WatchStatusTypes,
} from "@/graphql";

type Anime = CurrentlyAiringContinuedQuery["animes"]["nodes"][0];
interface HorizontalScrollInterface {
  animes: Anime[];
}

const HorizontalScroll = ({ animes }: HorizontalScrollInterface) => {
  const currentRef = useRef(null);

  const prevSlide = () => {
    const slide = currentRef.current;
    slide.scrollLeft -= slide.offsetWidth - 100;
    if (slide.scrollLeft <= 0) {
      slide.scrollLeft = slide.scrollWidth;
    }
  };
  const nextSlide = () => {
    const slide = currentRef.current;
    slide.scrollLeft += slide.offsetWidth - 100;
    if (slide.scrollLeft >= slide.scrollWidth - slide.offsetWidth) {
      slide.scrollLeft = 0;
    }
  };
  const display =
    animes?.map((anime) => {
      return <AnimeCard id={anime.id} key={anime.id} {...anime} />;
    }) ?? [];
  return (
    <>
      <Box position="relative" px="50px" my="15px" overflow="hidden">
        <ChevronLeftIcon
          onClick={prevSlide}
          position="absolute"
          top="45%"
          transform="translateY(-50%)"
          cursor="pointer"
          zIndex="100"
          h={45}
          w={45}
          left="0"
          visibility={display.length == 0 ? "hidden" : "visible"}
        />
        <ChevronRightIcon
          onClick={nextSlide}
          position="absolute"
          transform="translateY(-50%)"
          cursor="pointer"
          right="0"
          zIndex="100"
          top="45%"
          h={45}
          w={45}
          visibility={display.length == 0 ? "hidden" : "visible"}
        />
        <HStack
          width="full"
          overflow="hidden"
          spacing="15px"
          ref={currentRef}
          sx={{ scrollBehavior: "smooth" }}
        >
          {display.length == 0 ? (
            <Heading size="sm">No Animes Found</Heading>
          ) : (
            display
          )}
        </HStack>
      </Box>
    </>
  );
};

export default HorizontalScroll;
