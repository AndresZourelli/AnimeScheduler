import CharacterCard from "@/components/Home/CharacterCard";
import StaffCard from "@/components/Home/StaffCard";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { faGripfire } from "@fortawesome/free-brands-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AnimePageMain = ({
  title,
  description,
  animeGenres,
  animeCharacters,
  animeStaffs,
  fetching,
}) => {
  const [hasMoreCharacters, setHasMoreCharacters] = useState(false);
  const [hasMoreActors, setHasMoreActors] = useState(false);
  const [hasMoreStaff, setHasMoreStaff] = useState(false);

  const [numberOfCharacters, setNumberOfCharacters] = useState(
    animeCharacters?.nodes?.length ?? 0
  );
  const [currentCharactersDisplayed, setCharactersDisplayed] = useState(10);

  const [numberOfStaff, setNumberOfStaff] = useState(
    animeStaffs?.nodes?.length ?? 0
  );
  const [currentStaffDisplayed, setStaffDisplayed] = useState(10);

  useEffect(() => {
    if (currentCharactersDisplayed < numberOfCharacters) {
      setHasMoreCharacters(true);
    } else {
      setHasMoreCharacters(false);
    }
  }, [currentCharactersDisplayed, numberOfCharacters]);

  useEffect(() => {
    if (currentStaffDisplayed < numberOfStaff) {
      setHasMoreStaff(true);
    } else {
      setHasMoreStaff(false);
    }
  }, [currentStaffDisplayed, numberOfStaff]);

  const charactersShowMore = () => {
    setCharactersDisplayed((prevState) => prevState + 10);
  };

  const staffShowMore = () => {
    setStaffDisplayed((prevState) => prevState + 10);
  };

  const tagColors = [
    "gray",
    "blue",
    "cyan",
    "green",
    "orange",
    "pink",
    "purple",
    "red",
    "teal",
    "yellow",
  ];

  return (
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
        <Heading mb="2">{title}</Heading>
        <Box mb="2">
          {animeGenres.nodes.map((genre, idx) => {
            return (
              <Tag
                position="relative"
                mr="2"
                variant="outline"
                key={uuidv4()}
                colorScheme={tagColors[idx % animeGenres.nodes.length]}
              >
                <TagLabel>{genre.genre.genre}</TagLabel>
              </Tag>
            );
          })}
        </Box>
        <Text>{description}</Text>
        <Divider my="3" />
        <Heading mb="3">Characters</Heading>
        <Grid
          templateColumns="repeat(3, 350px)"
          gap={4}
          justifyContent="space-around"
          mb={4}
        >
          {animeCharacters?.nodes
            ?.slice(0, currentCharactersDisplayed)
            .sort(characterSort)
            .map((characterPreview) => {
              return (
                <CharacterCard
                  key={characterPreview.character.id}
                  character={characterPreview.character}
                  role={characterPreview.characterRole.role}
                  language={characterPreview.language.language}
                  actor={characterPreview.person}
                />
              );
            })}
        </Grid>
        <Box display="flex">
          {hasMoreCharacters ? (
            <Button m="auto" onClick={charactersShowMore} size="sm">
              Show More
            </Button>
          ) : null}
        </Box>
        <Divider my="3" />
        <Heading>Staff</Heading>
        <Flex wrap="wrap" justifyContent="flexStart">
          {animeStaffs?.nodes
            ?.slice(0, currentStaffDisplayed)
            .map((staffPreview) => {
              return (
                <StaffCard
                  key={staffPreview.person.id}
                  staff={staffPreview.person}
                  role={staffPreview.staffRole.role}
                />
              );
            })}
        </Flex>
        <Box display="flex">
          {hasMoreStaff ? (
            <Button m="auto" onClick={staffShowMore} size="sm">
              Show More
            </Button>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default AnimePageMain;

const characterSort = (a, b) => {
  if (a.characterRole.role.localeCompare("Main")) {
    return 1;
  }
  if (a.characterRole.role.localeCompare("Supporting")) {
    return -1;
  }
  return 0;
};
