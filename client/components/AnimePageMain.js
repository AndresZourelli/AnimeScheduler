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
import CharacterCard from "@/components/CharacterCard";
import ActorCard from "@/components/ActorCard";
import StaffCard from "@/components/StaffCard";

const AnimePageMain = ({
  description,
  title,
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
    characters.length
  );
  const [currentCharactersDisplayed, setCharactersDisplayed] = useState(10);

  const [numberOfActors, setNumberOfActors] = useState(actors.length);
  const [currentActorsDisplayed, setActorsDisplayed] = useState(10);

  const [numberOfStaff, setNumberOfStaff] = useState(staff.length);
  const [currentStaffDisplayed, setStaffDisplayed] = useState(10);

  useEffect(() => {
    if (currentCharactersDisplayed < numberOfCharacters) {
      setHasMoreCharacters(true);
    } else {
      setHasMoreCharacters(false);
    }
  }, [currentCharactersDisplayed]);

  useEffect(() => {
    if (currentActorsDisplayed < numberOfActors) {
      setHasMoreActors(true);
    } else {
      setHasMoreActors(false);
    }
  }, [currentActorsDisplayed]);

  useEffect(() => {
    if (currentStaffDisplayed < numberOfStaff) {
      setHasMoreStaff(true);
    } else {
      setHasMoreStaff(false);
    }
  }, [currentStaffDisplayed]);

  const charactersShowMore = () => {
    setCharactersDisplayed((prevState) => prevState + 10);
  };

  const actorsShowMore = () => {
    setActorsDisplayed((prevState) => prevState + 10);
  };

  const staffShowMore = () => {
    setStaffDisplayed((prevState) => prevState + 10);
  };
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
          {genres.map((genre) => {
            return (
              <Tag position="relative" mr="2" variant="outline" key={uuidv4()}>
                <TagLabel>{genre}</TagLabel>
              </Tag>
            );
          })}
        </Box>
        <Text>{description}</Text>
        <Divider my="3" />
        <Heading mb="3">Characters</Heading>
        <Flex wrap="wrap" justifyContent="flexStart">
          {characters.slice(0, currentCharactersDisplayed).map((character) => {
            return (
              <CharacterCard
                key={character.id}
                character={character}></CharacterCard>
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
          {actors.slice(0, currentActorsDisplayed).map((actor) => {
            return <ActorCard key={actor.id} actor={actor}></ActorCard>;
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
          {staff.slice(0, currentStaffDisplayed).map((staff) => {
            return <StaffCard key={staff.id} staff={staff}></StaffCard>;
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
