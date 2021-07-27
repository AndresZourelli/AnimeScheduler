import moment from "moment-timezone";
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
import ImageLoader from "@/components/Common/ImageLoader";

const AnimePageInfoCol = ({
  primary_image_url,
  number_of_episodes,
  start_broadcast_datetime,
  end_broadcast_datetime,
  duration,
  media_type_name,
  season_name,
  source_material_type_name,
  airing_status_type_name,
  rating,
  licensors,
  studios,
  alt_names,
  loading,
  producers,
  anime_title,
}) => {
  const [timerDays, setTimerDays] = useState("00");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");

  useEffect(() => {
    if (loading === false && source) {
      getCountDown(start_broadcast_datetime);
      return () => {
        clearInterval(internal.current);
      };
    }
  }, []);

  let internal = useRef();

  // if (!type || loading) {
  //   return (
  //     <Box>
  //       <Spinner size="xl" display="block" m="auto" my="10" />
  //     </Box>
  //   );
  // }

  const getCountDown = (start) => {
    const airDate = moment(start);
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

  const momentObj = start_broadcast_datetime
    ? moment.utc(parseInt(start_broadcast_datetime)).local()
    : "???";

  const air_date = start_broadcast_datetime
    ? new Date(parseInt(start_broadcast_datetime)).toLocaleDateString()
    : "???";
  const end_date = end_broadcast_datetime
    ? new Date(parseInt(end_broadcast_datetime)).toLocaleDateString()
    : "???";

  const broadcast_time_jst = moment.utc(parseInt(start_broadcast_datetime));
  return (
    <Box m="8" w="md">
      <Box width="225px">
        <Box height="300px" width="225px" minWidth="225px" position="relative">
          <ImageLoader image_url={primary_image_url} alt={anime_title} />
        </Box>
        <ButtonGroup my="4" isAttached w="100%">
          <Button isFullWidth>Add to List</Button>
          <Menu>
            <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
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
            <StatHelpText />
          </Stat>
        ) : null}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Broadcast Time</Heading>
        <Text>{broadcast_time_jst.tz("Asia/Tokyo").format("HH:mm z")}</Text>
        <Heading size="sm" mt="3">
          Broadcast Time (Local Time)
        </Heading>
        <Text>{momentObj.format("dddd, h:mm a")}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Number of Episodes</Heading>
        <Text>{number_of_episodes}</Text>
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
        <Text>{media_type_name}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Release Season</Heading>
        <Text>{season_name}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Source Material</Heading>
        <Text>{source_material_type_name}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Airing Status</Heading>
        <Text>{airing_status_type_name}</Text>
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
          <Text key={uuidv4()}>{licensor.licensor_name}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Producers</Heading>
        {producers.map((producer) => (
          <Text key={uuidv4()}>{producer.producer_name}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Studios</Heading>
        {studios.map((studio) => (
          <Text key={uuidv4()}>{studio.studio_name}</Text>
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
