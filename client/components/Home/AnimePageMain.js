import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

import {
  Spinner,
  Box,
  Heading,
  Tag,
  TagLabel,
  Flex,
  Text,
  Button,
  Divider,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripfire } from "@fortawesome/free-brands-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import CharacterCard from "@/components/Home/CharacterCard";
import ActorCard from "@/components/Home/ActorCard";
import StaffCard from "@/components/Home/StaffCard";

const AnimePageMain = ({
  anime_description,
  anime_title,
  genres,
  characters,
  actors,
  staff,
  loading,
}) => {
  const [hasMoreCharacters, setHasMoreCharacters] = useState(false);
  const [hasMoreActors, setHasMoreActors] = useState(false);
  const [hasMoreStaff, setHasMoreStaff] = useState(false);

  const [numberOfCharacters, setNumberOfCharacters] = useState(
    characters?.length ?? 0
  );
  const [currentCharactersDisplayed, setCharactersDisplayed] = useState(10);

  const [numberOfActors, setNumberOfActors] = useState(actors?.length ?? 0);
  const [currentActorsDisplayed, setActorsDisplayed] = useState(10);

  const [numberOfStaff, setNumberOfStaff] = useState(staff?.length ?? 0);
  const [currentStaffDisplayed, setStaffDisplayed] = useState(10);

  useEffect(() => {
    if (currentCharactersDisplayed < numberOfCharacters) {
      setHasMoreCharacters(true);
    } else {
      setHasMoreCharacters(false);
    }
  }, [currentCharactersDisplayed, numberOfCharacters]);

  useEffect(() => {
    if (currentActorsDisplayed < numberOfActors) {
      setHasMoreActors(true);
    } else {
      setHasMoreActors(false);
    }
  }, [currentActorsDisplayed, numberOfActors]);

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

  const actorsShowMore = () => {
    setActorsDisplayed((prevState) => prevState + 10);
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
        <Heading mb="2">{anime_title}</Heading>
        <Box mb="2">
          {genres.map((genre, idx) => {
            return (
              <Tag
                position="relative"
                mr="2"
                variant="outline"
                key={uuidv4()}
                colorScheme={tagColors[idx % genres.length]}
              >
                <TagLabel>{genre.genre_name}</TagLabel>
              </Tag>
            );
          })}
        </Box>
        <Text>{anime_description}</Text>
        <Divider my="3" />
        <Heading mb="3">Characters</Heading>
        <Flex wrap="wrap" justifyContent="flexStart">
          {characters
            ?.slice(0, currentCharactersDisplayed)
            .sort(characterSort)
            .map((character) => {
              return (
                <CharacterCard
                  key={character.character_id}
                  character={character}
                />
              );
            })}
        </Flex>
        <Box display="flex">
          {hasMoreCharacters ? (
            <Button m="auto" onClick={charactersShowMore} size="sm">
              Show More
            </Button>
          ) : null}
        </Box>
        <Divider my="3" />
        <Heading>Actors</Heading>
        <Flex wrap="wrap" justifyContent="flexStart">
          {actors?.slice(0, currentActorsDisplayed).map((actor) => {
            return <ActorCard key={actor.actor_id} actor={actor} />;
          })}
        </Flex>
        <Box display="flex">
          {hasMoreActors ? (
            <Button m="auto" onClick={actorsShowMore} size="sm">
              Show More
            </Button>
          ) : null}
        </Box>
        <Divider my="3" />
        <Heading>Staff</Heading>
        <Flex wrap="wrap" justifyContent="flexStart">
          {staff?.slice(0, currentStaffDisplayed).map((staff) => {
            return <StaffCard key={staff.staff_id} staff={staff} />;
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
  if (a.character_role_name.localeCompare("Main")) {
    return 1;
  }
  if (a.character_role_name.localeCompare("Supporting")) {
    return -1;
  }
  return 0;
};
