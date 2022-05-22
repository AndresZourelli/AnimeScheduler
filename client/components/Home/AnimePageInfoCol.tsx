import ImageLoader from "@/components/Common/ImageLoader";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  AgeRatingTypes,
  AiringStatusTypes,
  AlternateAnimeName,
  AlternateAnimeNamesConnection,
  AnimeGenresConnection,
  AnimeLicensorsConnection,
  AnimeProducersConnection,
  AnimeStudiosConnection,
  MediaTypes,
  Scalars,
  Season,
  SourceMaterialTypes,
  GetAnimeQuery,
} from "@/graphql";
import { add, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

type AltAnimeNameType = GetAnimeQuery["anime"]["alternateAnimeNames"];
type GenreListType = GetAnimeQuery["anime"]["genreList"];
type LicensorListType = GetAnimeQuery["anime"]["licensorList"];
type ProducerListType = GetAnimeQuery["anime"]["producerList"];
type StudioListType = GetAnimeQuery["anime"]["studioList"];
interface IAnimeInfoPageCol {
  fetching?: boolean;
  ageRatingType?: AgeRatingTypes;
  airingStatusType?: AiringStatusTypes;
  alternateAnimeNames?: AltAnimeNameType;
  genreList?: GenreListType;
  licensorList?: LicensorListType;
  producerList?: ProducerListType;
  studioList?: StudioListType;
  duration?: Scalars["Int"];
  startBroadcastDatetime?: Scalars["Datetime"];
  endBroadcastDatetime?: Scalars["Datetime"];
  mediaType?: MediaTypes;
  numberOfEpisodes?: Scalars["Int"];
  season?: Season;
  coverImage?: Scalars["String"];
  seasonYear?: Scalars["Int"];
  sourceMaterialType?: SourceMaterialTypes;
  title?: Scalars["String"];
}

const AnimePageInfoCol = ({
  ageRatingType,
  airingStatusType,
  alternateAnimeNames,
  genreList,
  licensorList,
  producerList,
  studioList,
  duration,
  startBroadcastDatetime,
  endBroadcastDatetime,
  mediaType,
  numberOfEpisodes,
  season,
  coverImage,
  seasonYear,
  sourceMaterialType,
  title,
  fetching,
}: IAnimeInfoPageCol) => {
  const [timerDays, setTimerDays] = useState("00");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");

  let internal = useRef();

  // if (!type || fetching) {
  //   return (
  //     <Box>
  //       <Spinner size="xl" display="block" m="auto" my="10" />
  //     </Box>
  //   );
  // }

  const momentObj: string = startBroadcastDatetime
    ? format(new Date(startBroadcastDatetime), "EEEE, p")
    : "???";

  const air_date = startBroadcastDatetime
    ? new Date(startBroadcastDatetime).toLocaleDateString()
    : "???";
  const end_date = endBroadcastDatetime
    ? new Date(endBroadcastDatetime).toLocaleDateString()
    : "???";

  const broadcast_time_jst = new Date(startBroadcastDatetime);
  return (
    <Box m="8" w="md">
      <Box width="225px">
        <Box position="relative">
          <ImageLoader image_url={coverImage} alt={title} maxW="225px" />
        </Box>
        <ButtonGroup my="4" isAttached w="100%">
          <Button w="full">Add to List</Button>
          <Menu>
            <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
            <MenuList>
              <MenuItem as={Button}>Hi</MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Box>
      <Box>
        {airingStatusType === AiringStatusTypes.CurrentlyAiring ? (
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
        <Text>
          {formatInTimeZone(
            broadcast_time_jst,
            "Asia/Tokyo",
            "yyyy-MM-dd HH:mm:ss"
          )}
        </Text>
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
        <Text>{mediaType}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Release Season</Heading>
        <Text>
          {season} {seasonYear}
        </Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Source Material</Heading>
        <Text>{sourceMaterialType}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Airing Status</Heading>
        <Text>{airingStatusType}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Age Rating</Heading>
        <Text>{ageRatingType}</Text>
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Licensors</Heading>
        {licensorList.nodes.map((licensorItem) => (
          <Text key={uuidv4()}>{licensorItem.licensor}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Producers</Heading>
        {producerList.nodes.map((producerItem) => (
          <Text key={uuidv4()}>{producerItem.producer}</Text>
        ))}
      </Box>
      <Divider my="3" />
      <Box>
        <Heading size="sm">Studios</Heading>
        {studioList.nodes.map((studioItem) => (
          <Text key={uuidv4()}>{studioItem.studio}</Text>
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
