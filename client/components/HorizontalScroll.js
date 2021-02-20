import { HStack, Box, Slider } from "@chakra-ui/react";
import AnimeCard from "@/components/AnimeCard";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const HorizontalScroll = ({ animes }) => {
  const currentRef = useRef(null);

  let startX = 0;
  let isDown = false;
  let scrollLeft = 0;

  const prevSlide = () => {
    const slide = currentRef.current;
    slide.scrollLeft -= slide.offsetWidth - 100;
    if (slide.scrollLeft <= 0) {
      slide.scrollLeft = slide.scrollWidth;
    }
    setScrollLeft(currentRef.scrollLeft);
  };
  const nextSlide = () => {
    const slide = currentRef.current;
    slide.scrollLeft += slide.offsetWidth - 100;
    if (slide.scrollLeft >= slide.scrollWidth - slide.offsetWidth) {
      slide.scrollLeft = 0;
    }
  };

  const onMouseDown = (e) => {
    isDown = true;

    startX = e.pageX - currentRef.current.offsetLeft;
    scrollLeft = currentRef.current.scrollLeft;
    document.addEventListener("mousemove", onMouseMove);
  };

  const onMouseLeave = (e) => {
    isDown = false;
  };

  const onMouseUp = (e) => {
    isDown = false;
    document.removeEventListener("mousemove", onMouseMove);
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    const x = e.pageX - currentRef.current.offsetLeft;
    const walk = (x - startX) * 3;
    currentRef.current.scrollLeft = scrollLeft - walk;
  };

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
      <Box
        position="relative"
        px="50px"
        my="15px"
        height="375px"
        overflow="hidden">
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
        />
        <HStack
          as="div"
          cursor="grabbing"
          height="100%"
          width="100%"
          spacing="15px"
          ref={currentRef}
          overflow="hidden"
          sx={{ scrollBehavior: "smooth" }}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          transition="all 0.2s">
          {display}
        </HStack>
      </Box>
    </>
  );
};

export default HorizontalScroll;
