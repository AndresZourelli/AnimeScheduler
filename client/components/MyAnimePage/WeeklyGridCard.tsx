import ImageLoader from "@/components/Common/ImageLoader";
import PopupMenuButton from "@/components/Common/PopupMenuButton";
import useAnimeList from "@/components/Hooks/useAnimeList";
import {
  Badge,
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  IconButton,
  Spacer,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { BsPlus, BsX } from "react-icons/bs";

const tagColors = [
  "whiteAlpha",
  "blackAlpha",
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
  "linkedin",
  "facebook",
  "messenger",
  "whatsapp",
  "twitter",
  "telegram",
];
import { Anime } from "@/graphql";

interface AnimeExtended extends Anime {
  formattedAirTime?: any;
  genres?: string[];
  studios?: string;
}

const WeeklyGridCard = ({
  title,
  coverImage,
  id,
  description,
  mediaType,
  averageWatcherRating,
  numberOfEpisodes,
  startBroadcastDatetime,
  userLiked,
  formattedAirTime,
  genres = [],
  studios = "",
}: AnimeExtended) => {
  const timer = null;
  // const timer = CountDownTimer({ endInputDate: startBroadcastDatetime });
  const {
    addAnimeResult,
    removeAnimeResult,
    addAnimeToList,
    removeAnimeFromList,
    user,
    userAnimeLists,
    AddToNewList,
    AddToExistingList,
  } = useAnimeList({ inputAnimeId: id, animeTitle: title });
  return (
    <Box m={2} borderRadius="xl" w="167px">
      <Flex minH="242px">
        <>
          <Box>
            <Box
              transition="all .3s ease-in-out"
              _hover={{
                transform: "scale(1.3)",
                zIndex: "100",
              }}
              role="group"
              position="relative"
            >
              <NextLink href={`/animes/${id}`}>
                <Box
                  minW="167px"
                  h="242px"
                  position="relative"
                  cursor="pointer"
                  overflow="hidden"
                  borderRadius="lg"
                  transition="all .3s ease-in-out"
                  _groupHover={{
                    borderRightRadius: "0px",
                  }}
                >
                  <ImageLoader
                    image_url={coverImage}
                    alt={title}
                    maxW="167px"
                  />
                  {userLiked ? (
                    <PopupMenuButton
                      customList={userAnimeLists}
                      animeId={id}
                      addToNewList={AddToNewList}
                      addToExistingList={AddToExistingList}
                    />
                  ) : (
                    <IconButton
                      aria-label="Remove anime from list button"
                      position="absolute"
                      icon={<BsPlus size="2rem" />}
                      isRound
                      bg="teal"
                      bottom="3%"
                      right="3%"
                      isLoading={removeAnimeResult.fetching}
                      onClick={(e) => addAnimeToList(e, id)}
                      visibility={user ? "visible" : "hidden"}
                    />
                  )}
                  <Badge
                    colorScheme="green"
                    position="absolute"
                    zIndex="100"
                    top="5px"
                    right="5px"
                    variant="solid"
                  >
                    {averageWatcherRating}
                  </Badge>
                </Box>
              </NextLink>
              <VStack
                position="absolute"
                p="0px"
                top="0"
                w="250px"
                h="full"
                bg="cyan.700"
                transform="translateX(0%)"
                opacity={0}
                borderRadius="lg"
                zIndex="-1"
                transition="all .3s ease-in-out"
                _groupHover={{
                  w: "250px",
                  opacity: 1,
                  transform: "translateX(167px)",
                  borderLeftRadius: "0px",
                  overflow: "hidden",
                }}
              >
                <Box w="full" p={1}>
                  <Grid templateColumns="repeat(3, 1fr)" fontSize="sm">
                    <Center fontSize=".75rem" borderWidth="0px 2px 2px 0">
                      Studio
                    </Center>
                    <Center fontSize=".75rem" borderWidth="0px 2px 2px 0">
                      Media
                    </Center>
                    <Center fontSize=".75rem" borderWidth="0px 0px 2px 0">
                      Episodes
                    </Center>
                    {/* <Center fontSize=".5rem" borderWidth="0px 2px 0px 0px">
                      {studios ?? null}
                    </Center> */}
                    <Center fontSize=".5rem" borderWidth="0px 2px 0px 0">
                      {mediaType}
                    </Center>
                    <Center fontSize=".5rem" borderWidth="0px 0px 0px 0">
                      {numberOfEpisodes}
                    </Center>
                  </Grid>
                </Box>
                <Box>
                  <Text fontSize="sm">Airs at {formattedAirTime}</Text>
                  <Text fontSize="sm">
                    Next Episode in{" "}
                    {`${timer?.days}d ${timer?.hours}h ${timer?.minutes}m ${timer?.seconds}s`}
                  </Text>
                </Box>
                <Spacer />
                {/* <Flex
                  mt="auto"
                  wrap="wrap"
                  justifySelf="flex-end"
                  bg="cyan.900"
                  w="full"
                  px="2"
                  pt="2"
                >
                  {genres?.map((item, i) => (
                    <Tag
                      borderRadius="full"
                      size="sm"
                      key={item}
                      mr="2"
                      colorScheme={tagColors[i % tagColors.length]}
                      variant="solid"
                      gap={3}
                      mb={2}
                    >
                      {item}
                    </Tag>
                  ))}
                </Flex> */}
              </VStack>
            </Box>
            <Heading fontSize="lg" py="3">
              {title}
            </Heading>
          </Box>
        </>
      </Flex>
    </Box>
  );
};

export default WeeklyGridCard;
