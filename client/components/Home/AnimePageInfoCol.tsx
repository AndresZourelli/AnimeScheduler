import moment from "moment-timezone";
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
  ageRating,
  airingStatus,
  alternateAnimeNames,
  animeGenres,
  animeLicensors,
  animeProducers,
  animeStudios,
  duration,
  startBroadcastDatetime,
  endBroadcastDatetime,
  mediaType,
  numberOfEpisodes,
  season,
  sourceMaterial,
  profileImage,
  title,
  fetching,
}) => {
  const [timerDays, setTimerDays] = useState("00");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");

  let internal = useRef();

  useEffect(() => {
    if (fetching === false && title) {
      getCountDown(startBroadcastDatetime);
    }
  }, []);

  // if (!type || fetching) {
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

    const timer = setInterval(() => {
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

  const momentObj: string = startBroadcastDatetime
    ? moment.utc(startBroadcastDatetime).local().format("dddd, h:mm a")
    : "???";

  const air_date = startBroadcastDatetime
    ? new Date(startBroadcastDatetime).toLocaleDateString()
    : "???";
  const end_date = endBroadcastDatetime
    ? new Date(endBroadcastDatetime).toLocaleDateString()
    : "???";

  const broadcast_time_jst = moment.utc(startBroadcastDatetime);
  return (
    <Box m="8" w="md">
      <Box width="225px">
        <Box height="300px" width="225px" minWidth="225px" position="relative">
          <ImageLoader image_url={profileImage.url} alt={title} />
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
        {airingStatus.airingStatusType === "Currently Airing" ? (
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
        <Text>{momentObj}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Number of Episodes</Heading>
        <Text>{numberOfEpisodes}</Text>
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
        <Text>{duration} min.</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Broadcast Media</Heading>
        <Text>{mediaType.mediaType}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Release Season</Heading>
        <Text>{season.season}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Source Material</Heading>
        <Text>{sourceMaterial.sourceMaterialType}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Airing Status</Heading>
        <Text>{airingStatus.airingStatusType}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Age Rating</Heading>
        <Text>{ageRating.ageRatingType}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Licensors</Heading>
        {animeLicensors.nodes.map((licensor) => (
          <Text key={uuidv4()}>{licensor.licensor.licensor}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Producers</Heading>
        {animeProducers.nodes.map((producer) => (
          <Text key={uuidv4()}>{producer.producer.producer}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Studios</Heading>
        {animeStudios.nodes.map((studio) => (
          <Text key={uuidv4()}>{studio.studio.studio}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Alternate Names</Heading>
        {alternateAnimeNames.nodes
          .map((name) => {
            return name.name;
          })
          .join(", ")}
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
