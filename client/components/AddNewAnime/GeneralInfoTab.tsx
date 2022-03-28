import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { add, differenceInYears, getYear, set, subYears } from "date-fns";
import { useGetGenresQuery } from "@/graphql";

const GeneralInfoTab = ({ inputSpacingCommon }) => {
  const [genreQueryResult, fetchGenres] = useGetGenresQuery();
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "otherNames",
  });
  const {
    fields: fieldsGenres,
    append: appendGenre,
    remove: removeGenre,
  } = useFieldArray({
    name: "genres",
  });

  const seasonList = getSeasons();
  const yearsList = getYears();
  const monthsList = getMonths();
  const daysList = getDays();
  const hoursList = getHours();
  const minutesList = getMinutes();

  return (
    <>
      <Box>
        <Heading>Anime Info</Heading>
        <Flex wrap="wrap">
          <Box>
            <Heading size="md">Titles</Heading>
            <Box>
              <Flex wrap="wrap">
                <FormControl
                  id="titles.english"
                  isInvalid={errors.title?.english}
                  w={inputSpacingCommon.width}
                  mb={inputSpacingCommon.marginBottom}
                  mr={inputSpacingCommon.marginRight}
                >
                  <FormLabel>English Title</FormLabel>
                  <Input
                    placeholder="English Title"
                    {...register("titles.english")}
                  />
                  <FormErrorMessage>{errors.titles?.english}</FormErrorMessage>
                </FormControl>

                <FormControl
                  id="titles.japanese"
                  isInvalid={errors.titles?.japanese}
                  w={inputSpacingCommon.width}
                  mb={inputSpacingCommon.marginBottom}
                  mr={inputSpacingCommon.marginRight}
                >
                  <FormLabel>Japanese Title</FormLabel>
                  <Input
                    placeholder="Japanese Title"
                    {...register("titles.japanese")}
                  />
                  <FormErrorMessage>{errors.titles?.japanese}</FormErrorMessage>
                </FormControl>

                <FormControl
                  id="titles.romaji"
                  isInvalid={errors.titles?.romaji}
                  w={inputSpacingCommon.width}
                  mb={inputSpacingCommon.marginBottom}
                  mr={inputSpacingCommon.marginRight}
                >
                  <FormLabel>Romaji Title</FormLabel>
                  <Input
                    placeholder="Romaji Title"
                    {...register("titles.romaji")}
                  />
                  <FormErrorMessage>{errors.titles?.romaji}</FormErrorMessage>
                </FormControl>
              </Flex>
            </Box>
            <Text fontSize="md" mb={inputSpacingCommon.marginBottom}>
              Other Names
            </Text>
            <Flex>
              {fields.map((field, nameIndex) => (
                <FormControl
                  isInvalid={errors.otherNames}
                  w={inputSpacingCommon.width}
                  mb={inputSpacingCommon.marginBottom}
                  key={field.id}
                  mr={inputSpacingCommon.marginRight}
                >
                  <InputGroup>
                    <Input
                      name={`otherNames[${nameIndex}].name`}
                      placeholder="Other Names"
                      {...register(`otherNames[${nameIndex}].name`)}
                    />
                    {fields.length > 1 ? (
                      <InputRightElement
                        children={
                          <CloseButton
                            color="red.500"
                            onClick={() => remove(nameIndex)}
                          />
                        }
                      />
                    ) : null}
                  </InputGroup>
                  <FormErrorMessage>{errors.otherNames}</FormErrorMessage>
                </FormControl>
              ))}
              <Button
                onClick={() => append({ name: "", value: "" })}
                mb={inputSpacingCommon.marginBottom}
                alignSelf="flex-end"
              >
                Add
              </Button>
            </Flex>
          </Box>
          <Box>
            <Flex wrap="wrap">
              <FormControl
                isInvalid={errors.numberOfEpisodes}
                mr={inputSpacingCommon.marginRight}
                mb={inputSpacingCommon.marginBottom}
                min={0}
                w={inputSpacingCommon.width}
              >
                <FormLabel>Number of Episodes</FormLabel>
                <Controller
                  name="numberOfEpisodes"
                  render={({ field }) => (
                    <NumberInput {...field} min={0}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />

                <FormErrorMessage>{errors.numberOfEpisodes}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={errors.duration}
                mr={inputSpacingCommon.marginRight}
                mb={inputSpacingCommon.marginBottom}
                min={0}
                w={inputSpacingCommon.width}
              >
                <FormLabel>Length (in minutes)</FormLabel>

                <Controller
                  name="duration"
                  render={({ field }) => (
                    <NumberInput {...field} min={0}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>{errors.duration}</FormErrorMessage>
              </FormControl>
            </Flex>
          </Box>
          <FormControl
            id="description"
            isInvalid={errors.description}
            minW={inputSpacingCommon.width}
            mb={inputSpacingCommon.marginBottom}
            mr={inputSpacingCommon.marginRight}
          >
            <FormLabel>Anime description</FormLabel>
            <Textarea
              placeholder="Anime description"
              {...register("description")}
              minW="400px"
            />
            <FormErrorMessage>{errors.youtubeTrailerId}</FormErrorMessage>
          </FormControl>
          <FormControl
            w={inputSpacingCommon.width}
            mr={inputSpacingCommon.marginRight}
            mb={inputSpacingCommon.marginBottom}
          >
            <FormLabel>Country of Origin</FormLabel>
            <Select
              name="countryOfOrigin"
              {...register("countryOfOrigin")}
              placeholder="Select Option"
            >
              <option value="japan">Japan</option>
              <option value="south korea">South Korea</option>
              <option value="china">China</option>
              <option value="taiwan">Taiwan</option>
              <option value="usa">USA</option>
            </Select>
            <FormErrorMessage>{errors.countryOfOrigin}</FormErrorMessage>
          </FormControl>
          <Box>
            <Heading size="sm" mb={2}>
              Genres
            </Heading>
            <Flex wrap="wrap">
              <Flex wrap="wrap">
                {fieldsGenres.map((field, genreIndex) => (
                  <FormControl
                    id="genres"
                    isInvalid={errors.genres}
                    w={inputSpacingCommon.width}
                    mb={inputSpacingCommon.marginBottom}
                    key={genreIndex}
                    mr={2}
                  >
                    <Flex>
                      <Select
                        name={`genres[${genreIndex}].genreId`}
                        placeholder="Select Option"
                        {...register(`genres[${genreIndex}].genreId`)}
                      >
                        {genreQueryResult.data?.genres.nodes.map((genre) => (
                          <option value={genre.id} key={genre.id}>
                            {genre.genre}
                          </option>
                        ))}
                      </Select>
                      {fieldsGenres.length > 1 ? (
                        <CloseButton
                          alignSelf="center"
                          color="red.500"
                          onClick={() => removeGenre(genreIndex)}
                        />
                      ) : null}
                      <FormErrorMessage>{errors.genres}</FormErrorMessage>
                    </Flex>
                  </FormControl>
                ))}
              </Flex>
              <Button onClick={() => appendGenre({ genreId: "" })}>Add</Button>
            </Flex>
          </Box>
          <FormControl
            w={inputSpacingCommon.width}
            mr={inputSpacingCommon.marginRight}
            mb={inputSpacingCommon.marginBottom}
          >
            <FormLabel>Source</FormLabel>
            <Select
              name="source"
              {...register("source")}
              placeholder="Select Option"
            >
              <option value="original">Original</option>
              <option value="manga">Manga</option>
              <option value="anime">Anime</option>
              <option value="light novel">Light Novel</option>
              <option value="novel">Novel</option>
              <option value="visual novel">Visual Novel</option>
              <option value="web novel">Web Novel</option>
              <option value="video game">Video Game</option>
              <option value="doujinshi">Doujinshi</option>
            </Select>
            <FormErrorMessage>{errors.source}</FormErrorMessage>
          </FormControl>
          <Flex wrap="wrap">
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Format Type</FormLabel>
              <Select
                name="formatType"
                {...register("formatType")}
                placeholder="Select Option"
              >
                <option value="tv">TV</option>
                <option value="tv short">TV Short</option>
                <option value="movie">Movie</option>
                <option value="special">Special</option>
                <option value="ova">OVA</option>
                <option value="ona">ONA</option>
                <option value="music">Music</option>
              </Select>
              <FormErrorMessage>{errors.formatType}</FormErrorMessage>
            </FormControl>
          </Flex>
        </Flex>
      </Box>
      <Box>
        <Heading>Release Info</Heading>
        <Box>
          <Flex wrap="wrap">
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                {...register("status")}
                placeholder="Select Option"
              >
                <option value="finishedAiring">Finished Airing</option>
                <option value="currentlyAiring">Currently Airing</option>
                <option value="notYetAired">Not Yet Aired</option>
                <option value="cancelled">Cancelled</option>
                <option value="hiatus">Haitus</option>
              </Select>
              <FormErrorMessage>{errors.status}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
            >
              <FormLabel>Season</FormLabel>
              <Flex gap={3}>
                <Select
                  name="airingSeason.season"
                  {...register("airingSeason.season")}
                  placeholder="Select Option"
                  minW={inputSpacingCommon.width}
                >
                  {seasonList.map((season) => (
                    <option key={season} value={season.toLowerCase()}>
                      {season}
                    </option>
                  ))}
                </Select>
                <Select
                  name="airingSeason.year"
                  {...register("airingSeason.year")}
                  placeholder="Select Option"
                  minW={inputSpacingCommon.width}
                >
                  {yearsList.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </Flex>

              <FormErrorMessage>{errors.status}</FormErrorMessage>
            </FormControl>
          </Flex>
        </Box>

        <Box>
          <Heading size="sm">Start Date</Heading>
          <Flex wrap="wrap">
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>year</FormLabel>
              <Select
                name="startDate.year"
                placeholder="Select Option"
                {...register("startDate.year")}
              >
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.startDate?.year}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Month</FormLabel>
              <Select
                name="startDate.month"
                placeholder="Select Option"
                {...register("startDate.month")}
              >
                {monthsList.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.startDate?.month}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Day</FormLabel>
              <Select
                name="startDate.day"
                placeholder="Select Option"
                {...register("startDate.day")}
              >
                {daysList.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.startDate?.day}</FormErrorMessage>
            </FormControl>
          </Flex>
        </Box>
        <Box>
          <Heading size="sm">End Date</Heading>
          <Flex wrap="wrap">
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>year</FormLabel>
              <Select
                name="endDate.year"
                placeholder="Select Option"
                {...register("endDate.year")}
              >
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.endDate?.year}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Month</FormLabel>
              <Select
                name="endDate.month"
                placeholder="Select Option"
                {...register("endDate.month")}
              >
                {monthsList.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.endDate?.month}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Day</FormLabel>
              <Select
                name="endDate.day"
                {...register("endDate.day")}
                placeholder="Select Option"
              >
                {daysList.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.endDate?.day}</FormErrorMessage>
            </FormControl>
          </Flex>
        </Box>
        <Box>
          <Heading size="sm">Air Time</Heading>
          <Flex wrap="wrap">
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Hour (24-hour format)</FormLabel>
              <Select
                name="airTimeJst.hour"
                placeholder="Select Option"
                {...register("airTimeJst.hour")}
              >
                {hoursList.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.airTimeJst?.hour}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Minute</FormLabel>
              <Select
                name="airTimeJst.minute"
                placeholder="Select Option"
                {...register("airTimeJst.minute")}
              >
                {minutesList.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.airTimeJst?.minute}</FormErrorMessage>
            </FormControl>
          </Flex>
        </Box>
      </Box>

      <Box>
        <Heading>Online Info</Heading>
        <Flex wrap="wrap">
          <FormControl
            id="myAnimeListId"
            isInvalid={errors.myAnimeListId}
            w={inputSpacingCommon.width}
            mb={inputSpacingCommon.marginBottom}
            mr={inputSpacingCommon.marginRight}
          >
            <FormLabel>MyAnimeList Id</FormLabel>
            <Input
              placeholder="MyAnimeList Id"
              {...register("myAnimeListId")}
            />
            <FormErrorMessage>{errors.myAnimeListId}</FormErrorMessage>
          </FormControl>
          <FormControl
            id="youtubeTrailerId"
            isInvalid={errors.youtubeTrailerId}
            w={inputSpacingCommon.width}
            mb={inputSpacingCommon.marginBottom}
            mr={inputSpacingCommon.marginRight}
          >
            <FormLabel>Youtube Trailer Id</FormLabel>
            <Input
              placeholder="Youtube Trailer Id"
              {...register("youtubeTrailerId")}
            />
            <FormErrorMessage>{errors.youtubeTrailerId}</FormErrorMessage>
          </FormControl>
          <FormControl
            id="twitterHandle"
            isInvalid={errors.twitterHandle}
            w={inputSpacingCommon.width}
            mb={inputSpacingCommon.marginBottom}
            mr={inputSpacingCommon.marginRight}
          >
            <FormLabel>Twitter Handle</FormLabel>
            <Input
              placeholder="Twitter Handle"
              {...register("twitterHandle")}
            />
            <FormErrorMessage>{errors.twitterHandle}</FormErrorMessage>
          </FormControl>
          <FormControl
            id="officialWebsite"
            isInvalid={errors.officialWebsite}
            w={inputSpacingCommon.width}
            mb={inputSpacingCommon.marginBottom}
            mr={inputSpacingCommon.marginRight}
          >
            <FormLabel>Official Website</FormLabel>
            <Input
              placeholder="Official Website"
              {...register("officialWebsite")}
            />
            <FormErrorMessage>{errors.officialWebsite}</FormErrorMessage>
          </FormControl>
        </Flex>
      </Box>
      <Box>
        <Heading>Images</Heading>
        <Text>Create Upload</Text>
      </Box>
    </>
  );
};

export default GeneralInfoTab;

const getSeasons = () => {
  const seasonList = ["Winter", "Spring", "Summer", "Fall"];
  return seasonList;
};

const getYears = () => {
  let yearList = [];
  let startDate = add(new Date(), { years: 3 });
  let endDate = set(new Date(), { year: 1900, month: 0, date: 1 });
  while (differenceInYears(endDate, startDate) <= 0) {
    yearList.push(`${getYear(startDate)}`);
    startDate = subYears(startDate, 1);
  }
  return yearList;
};

const getMonths = () => {
  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthList;
};

const getDays = () => {
  const dayList = [];
  for (let i = 1; i < 32; i++) {
    dayList.push(i);
  }
  return dayList;
};

const getHours = () => {
  const hourList = [];
  for (let i = 0; i < 24; i++) {
    hourList.push(i);
  }
  return hourList;
};

const getMinutes = () => {
  const minuteList = [];
  for (let i = 0; i < 60; i++) {
    minuteList.push(i);
  }
  return minuteList;
};
