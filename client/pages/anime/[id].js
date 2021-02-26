import Nav from "@/components/Nav";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import {
  Spinner,
  Box,
  Heading,
  Tag,
  TagLabel,
  TagLeftIcon,
  Flex,
  Text,
  IconButton,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripfire } from "@fortawesome/free-brands-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import NextImage from "next/image";
import { useState, useEffect, useRef } from "react";

const GET_ANIME = gql`
  query GetAnime($anime_id: ID!) {
    getAnime(anime_id: $anime_id) {
      id: _id
      title
      avg_score
      description
      image_url
      episodes
      aired_start
      aired_end
      broadcast_day
      broadcast_time
      duration
      type
      season
      source
      status
      rating
      genres
      licensors
      producers
      studios
      alt_names {
        Japanese
        English
        Synonyms
      }
      minutes_watched
    }
  }
`;

const animePage = () => {
  const [timerDays, setTimerDays] = useState("00");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");

  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_ANIME, {
    variables: { anime_id: id },
    skip: !id,
  });

  let internal = useRef();

  const getCountDown = (start) => {
    const airDate = moment(parseInt(start));
    let today = moment();
    while (airDate < today) {
      airDate.add(1, "week");
    }

    internal = setInterval(() => {
      today = moment();
      const diff = airDate.diff(today);
      const day = Math.trunc(moment.duration(diff).asDays())?.toLocaleString(
        "en-US",
        {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }
      );

      const hour = (
        Math.trunc(moment.duration(diff).asHours()) % 24
      )?.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      const minute = (
        Math.trunc(moment.duration(diff).asMinutes()) % 60
      )?.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      const second = (
        Math.trunc(moment.duration(diff).asSeconds()) % 60
      )?.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });

      if (diff < 0) {
        clearInterval(internal.current);
      } else {
        setTimerDays(day);
        setTimerHours(hour);
        setTimerMinutes(minute);
        setTimerSeconds(second);
      }
    }, 1000);
  };

  const anime = data?.getAnime;
  useEffect(() => {
    if (loading === false && anime) {
      getCountDown(anime?.aired_start);
      return () => {
        clearInterval(internal.current);
      };
    }
  }, [loading, anime]);

  if (!id || loading) {
    return (
      <Box>
        <Nav />
        <Spinner size="xl" display="block" m="auto" my="10"></Spinner>
      </Box>
    );
  }

  return (
    <Box position="relative">
      <Nav />
      <Flex position="relative">
        <Box m="8">
          <Box width="225px">
            <Box
              height="300px"
              width="225px"
              minWidth="225px"
              position="relative">
              <NextImage layout="fill" src={anime.image_url} />
            </Box>
            <ButtonGroup my="4" isAttached w="100%">
              <Button isFullWidth>Add to List</Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<ChevronDownIcon />}></MenuButton>
                <MenuList>
                  <MenuItem as={Button}>Hi</MenuItem>
                </MenuList>
              </Menu>
            </ButtonGroup>
          </Box>
          <Box>
            {anime.status === "Currently Airing" ? (
              <Stat>
                <StatLabel>Next Episode</StatLabel>
                <StatNumber>{`${timerDays}:${timerHours}:${timerMinutes}:${timerSeconds}`}</StatNumber>
                <StatHelpText></StatHelpText>
              </Stat>
            ) : null}
          </Box>
        </Box>
        <Box position="relative" justifySelf="end" mt="8">
          <Box>
            <Tag position="relative" mr="2">
              <FontAwesomeIcon icon={faGripfire} color="orange" />
              <TagLabel ml="1">#12 Top Rated</TagLabel>
            </Tag>
            <Tag position="relative">
              <FontAwesomeIcon icon={faEye} color="grey" />
              <TagLabel ml="1">#3 Most Viewed</TagLabel>
            </Tag>
          </Box>
          <Box my="3" mr="16">
            <Heading mb="2">{anime.title}</Heading>
            <Box mb="2">
              {anime.genres.map((genre) => {
                return (
                  <Tag
                    position="relative"
                    mr="2"
                    variant="outline"
                    key={uuidv4()}>
                    <TagLabel>{genre}</TagLabel>
                  </Tag>
                );
              })}
            </Box>
            <Text>{anime.description}</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default animePage;
