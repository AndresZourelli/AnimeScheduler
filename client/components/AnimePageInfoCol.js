import moment from "moment";
import NextImage from "next/image";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";
import {
  Spinner,
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stat,
  StatNumber,
  StatHelpText,
  Divider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import ImageLoader from "./ImageLoader";

const AnimePageInfoCol = ({
  image_url,
  episodes,
  aired_start,
  aired_end,
  duration,
  type,
  season,
  source,
  status,
  rating,
  licensors,
  studios,
  alt_names,
  loading,
  broadcast_day,
  broadcast_time,
  producers,
  title,
}) => {
  const [timerDays, setTimerDays] = useState("00");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");

  useEffect(() => {
    if (loading === false && source) {
      getCountDown(aired_start);
      return () => {
        clearInterval(internal.current);
      };
    }
  }, []);

  if (!type || loading) {
    return (
      <Box>
        <Spinner size="xl" display="block" m="auto" my="10"></Spinner>
      </Box>
    );
  }

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

  const momentObj = aired_start
    ? moment.utc(parseInt(aired_start)).local()
    : "???";
  const air_date = aired_start
    ? new Date(parseInt(aired_start)).toLocaleDateString()
    : "???";
  const end_date = aired_end
    ? new Date(parseInt(aired_end)).toLocaleDateString()
    : "???";

  return (
    <Box m="8" w="md">
      <Box width="225px">
        <Box height="300px" width="225px" minWidth="225px" position="relative">
          <ImageLoader image_url={image_url} alt={title}></ImageLoader>
        </Box>
        <ButtonGroup my="4" isAttached w="100%">
          <Button isFullWidth>Add to List</Button>
          <Menu>
            <MenuButton as={IconButton} icon={<ChevronDownIcon />}></MenuButton>
            <MenuList>
              <MenuItem as={Button}>Hi</MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Box>
      <Box>
        {status === "Currently Airing" ? (
          <Stat>
            <Heading size="sm">Next Episode</Heading>
            <StatNumber fontSize="md">{`${timerDays}:${timerHours}:${timerMinutes}:${timerSeconds}`}</StatNumber>
            <StatHelpText></StatHelpText>
          </Stat>
        ) : null}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Broadcast Time</Heading>
        <Text>
          {broadcast_day} {broadcast_time}
        </Text>
        <Heading size="sm" mt="3">
          Broadcast Time (Local Time)
        </Heading>
        <Text>{momentObj.format("dddd, h:mm a")}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Number of Episodes</Heading>
        <Text>{episodes}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">First Episode</Heading>
        <Text>{air_date}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Last Episode</Heading>
        <Text>{end_date}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Average Episode Length</Heading>
        <Text>{duration}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Broadcast Media</Heading>
        <Text>{type}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Release Season</Heading>
        <Text>{season}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Source Material</Heading>
        <Text>{source}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Airing Status</Heading>
        <Text>{status}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Age Rating</Heading>
        <Text>{rating}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Licensors</Heading>
        {licensors.map((licensor) => (
          <Text key={uuidv4()}>{licensor}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Producers</Heading>
        {producers.map((producer) => (
          <Text key={uuidv4()}>{producer}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Studios</Heading>
        {studios.map((studio) => (
          <Text key={uuidv4()}>{studio}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Alternate Names</Heading>
        {showAltNames(alt_names)}
      </Box>
    </Box>
  );
};

export default AnimePageInfoCol;

const showAltNames = (obj) => {
  if (obj === undefined || obj === null) {
    return null;
  }
  let names = [];
  for (let key of Object.keys(obj)) {
    if (key === "__typename") {
      continue;
    }
    names.push(
      <Text key={uuidv4()}>
        <b>{key}:</b> {obj[key]}
      </Text>
    );
  }
  return names;
};
