import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { BsXCircle, BsEyeSlash, BsEye } from "react-icons/bs";
import moment from "moment";
import NextLink from "next/link";
import ImageLoader from "./ImageLoader";
import { useState, useEffect } from "react";

const WeeklyGridCard = ({
  title,
  image_url,
  aired_start,
  id,
  deleteAnime,
  formattedAirTime,
}) => {
  const [isWatched, setIsWatched] = useState(false);
  const [opacity, setOpacity] = useState(false);

  const toggleWatched = () => {
    setIsWatched((prevState) => !prevState);
    setOpacity((prevState) => !prevState);
  };

  const onDelete = () => {
    deleteAnime(id);
  };

  return (
    <Box
      m={2}
      bg="blue.300"
      borderRadius="xl"
      overflow="hidden"
      opacity={opacity ? ".6" : "1"}>
      <Flex>
        <NextLink href={`/anime/${id}`}>
          <>
            <Box
              minW="96px"
              h="144px"
              mr="2"
              position="relative"
              borderRadius="lg">
              <ImageLoader image_url={image_url} alt={title}></ImageLoader>
            </Box>
            <Box textAlign="center" width="100%" borderRadius="lg" p="3">
              <Heading size="sm">{title}</Heading>
              <Text size="sm">Airs at {formattedAirTime}</Text>
            </Box>
          </>
        </NextLink>
        <Box pt="3" pr="3">
          <Box mb="3" cursor="pointer" onClick={onDelete}>
            <BsXCircle />
          </Box>
          <Box mb="3" cursor="pointer" onClick={toggleWatched}>
            {isWatched ? <BsEyeSlash /> : <BsEye />}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default WeeklyGridCard;
