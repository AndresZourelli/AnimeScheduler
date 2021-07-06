import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Heading,
  Select,
  InputRightElement,
  InputGroup,
  CloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import { FieldArray, Field, getIn } from "formik";
import moment from "moment";

const GeneralInfoTab = ({
  values,
  errors,
  touched,
  handleChange,
  inputSpacingCommon,
}) => {
  const seasonList = getSeasons();
  const yearsList = getYears();
  const monthsList = getMonths();
  const daysList = getDays();
  const hoursList = getHours();
  const minutesList = getMinutes();
  return (
    <>
      <Box>
        <Heading>Titles</Heading>
        <Box>
          <Flex wrap="wrap">
            <FormControl
              id="titles.english"
              isInvalid={
                errors.titles &&
                getIn(errors.titles, "english") &&
                touched.titles &&
                getIn(errors.titles, "english")
              }
              w={inputSpacingCommon.width}
              mb={inputSpacingCommon.marginBottom}
              mr={inputSpacingCommon.marginRight}
            >
              <FormLabel>English Title</FormLabel>
              <Input
                placeholder="English Title"
                value={values.titles.english}
                onChange={handleChange}
              />
              <FormErrorMessage>
                {getIn(errors.titles, "english")}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="titles.japanese"
              isInvalid={
                errors.titles &&
                getIn(errors.titles, "japanese") &&
                touched.titles &&
                getIn(errors.titles, "japanese")
              }
              w={inputSpacingCommon.width}
              mb={inputSpacingCommon.marginBottom}
              mr={inputSpacingCommon.marginRight}
            >
              <FormLabel>Japanese Title</FormLabel>
              <Input
                placeholder="Japanese Title"
                value={values.titles.japanese}
                onChange={handleChange}
              />
              <FormErrorMessage>
                {getIn(errors.titles, "japanese")}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="titles.romaji"
              isInvalid={
                errors.titles &&
                getIn(errors.titles, "romaji") &&
                touched.titles &&
                getIn(errors.titles, "romaji")
              }
              w={inputSpacingCommon.width}
              mb={inputSpacingCommon.marginBottom}
              mr={inputSpacingCommon.marginRight}
            >
              <FormLabel>Romaji Title</FormLabel>
              <Input
                placeholder="Romaji Title"
                value={values.titles.romaji}
                onChange={handleChange}
              />
              <FormErrorMessage>
                {getIn(errors.titles, "romaji")}
              </FormErrorMessage>
            </FormControl>
          </Flex>
        </Box>
        <Text fontSize="md" mb={inputSpacingCommon.marginBottom}>
          Other Names
        </Text>
        <FieldArray name="otherNames">
          {({ push, remove }) => (
            <>
              {values.otherNames.map((name, nameIndex) => (
                <FormControl
                  id="otherNames"
                  isInvalid={errors.otherNames && touched.otherNames}
                  w={inputSpacingCommon.width}
                  mb={inputSpacingCommon.marginBottom}
                  key={nameIndex}
                  mr={inputSpacingCommon.marginRight}
                >
                  <InputGroup>
                    <Field
                      as={Input}
                      name={`otherNames[${nameIndex}].name`}
                      placeholder="Other Names"
                      onChange={handleChange}
                    />
                    {values.otherNames.length > 1 ? (
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
                onClick={() => push({ name: "" })}
                mb={inputSpacingCommon.marginBottom}
                alignSelf="flex-end"
              >
                Add
              </Button>
            </>
          )}
        </FieldArray>
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
              <Field name="status" as={Select} placeholder="Select Option">
                <option value="finishedAiring">Finished Airing</option>
                <option value="currentlyAiring">Currently Airing</option>
                <option value="notYetAired">Not Yet Aired</option>
                <option value="cancelled">Cancelled</option>
                <option value="hiatus">Haitus</option>
              </Field>
              <FormErrorMessage>{errors.status}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
            >
              <FormLabel>Season</FormLabel>
              <Field name="season" as={Select} placeholder="Select Option">
                {seasonList.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>{errors.status}</FormErrorMessage>
            </FormControl>
          </Flex>
        </Box>
        <Box>
          <Flex wrap="wrap">
            <FormControl
              isInvalid={errors.numberOfEpisodes && touched.numberOfEpisodes}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
              min={0}
              w={inputSpacingCommon.width}
            >
              <FormLabel>Number of Episodes</FormLabel>
              <Field name="numberOfEpisodes">
                {({ field, form }) => (
                  <NumberInput
                    min={0}
                    onChange={(val) => form.setFieldValue(field.name, val)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              </Field>
              <FormErrorMessage>{errors.numberOfEpisodes}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.duration && touched.duration}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
              min={0}
              w={inputSpacingCommon.width}
            >
              <FormLabel>Length (in minutes)</FormLabel>
              <Field name="duration">
                {({ field, form }) => (
                  <NumberInput
                    onChange={(val) => form.setFieldValue(field.name, val)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              </Field>
              <FormErrorMessage>{errors.duration}</FormErrorMessage>
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
              <Field
                name="startDate.year"
                as={Select}
                placeholder="Select Option"
              >
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>
                {getIn(errors.startDate, "year")}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Month</FormLabel>
              <Field
                name="startDate.month"
                as={Select}
                placeholder="Select Option"
              >
                {monthsList.map((month) => (
                  <option key={month.index} value={month.index}>
                    {month.monthName}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>
                {getIn(errors.startDate, "month")}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Day</FormLabel>
              <Field
                name="startDate.day"
                as={Select}
                placeholder="Select Option"
              >
                {daysList.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>
                {getIn(errors.startDate, "day")}
              </FormErrorMessage>
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
              <Field
                name="endDate.year"
                as={Select}
                placeholder="Select Option"
              >
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>
                {getIn(errors.endDate, "year")}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Month</FormLabel>
              <Field
                name="endDate.month"
                as={Select}
                placeholder="Select Option"
              >
                {monthsList.map((month) => (
                  <option key={month.index} value={month.index}>
                    {month.monthName}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>
                {getIn(errors.endDate, "month")}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Day</FormLabel>
              <Field name="endDate.day" as={Select} placeholder="Select Option">
                {daysList.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>
                {getIn(errors.endDate, "day")}
              </FormErrorMessage>
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
              <Field
                name="airTimeJst.hour"
                as={Select}
                placeholder="Select Option"
              >
                {hoursList.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>
                {getIn(errors.airTimeJst, "hour")}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Minute</FormLabel>
              <Field
                name="airTimeJst.minute"
                as={Select}
                placeholder="Select Option"
              >
                {minutesList.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>
                {getIn(errors.airTimeJst, "minute")}
              </FormErrorMessage>
            </FormControl>
          </Flex>
        </Box>
        <Box>
          <Heading size="sm">Typings</Heading>
          <Flex wrap="wrap">
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Format Type</FormLabel>
              <Field name="formatType" as={Select} placeholder="Select Option">
                <option value="tv">TV</option>
                <option value="tv short">TV Short</option>
                <option value="movie">Movie</option>
                <option value="special">Special</option>
                <option value="ova">OVA</option>
                <option value="ona">ONA</option>
                <option value="music">Music</option>
              </Field>
              <FormErrorMessage>{errors.formatType}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Source</FormLabel>
              <Field name="source" as={Select} placeholder="Select Option">
                <option value="original">Original</option>
                <option value="manga">Manga</option>
                <option value="anime">Anime</option>
                <option value="light novel">Light Novel</option>
                <option value="novel">Novel</option>
                <option value="visual novel">Visual Novel</option>
                <option value="web novel">Web Novel</option>
                <option value="video game">Video Game</option>
                <option value="doujinshi">Doujinshi</option>
              </Field>
              <FormErrorMessage>{errors.source}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={inputSpacingCommon.width}
              mr={inputSpacingCommon.marginRight}
              mb={inputSpacingCommon.marginBottom}
            >
              <FormLabel>Source</FormLabel>
              <Field
                name="countryOfOrigin"
                as={Select}
                placeholder="Select Option"
              >
                <option value="japan">Japan</option>
                <option value="south korea">South Korea</option>
                <option value="china">China</option>
                <option value="taiwan">Taiwan</option>
                <option value="usa">USA</option>
              </Field>
              <FormErrorMessage>{errors.countryOfOrigin}</FormErrorMessage>
            </FormControl>
          </Flex>
        </Box>
        <Box>
          <Heading size="sm" mb={2}>
            Genres
          </Heading>
          <Flex wrap="wrap">
            <FieldArray name="genres">
              {({ push, remove }) => (
                <>
                  <Flex wrap="wrap">
                    {values.genres.map((genreInput, genreIndex) => (
                      <FormControl
                        id="genres"
                        isInvalid={errors.genres && touched.genres}
                        w={inputSpacingCommon.width}
                        mb={inputSpacingCommon.marginBottom}
                        key={genreIndex}
                        mr={2}
                      >
                        <Flex>
                          <Field
                            as={Select}
                            name={`genres[${genreIndex}].genreId`}
                            placeholder="Select Option"
                          >
                            {["Action", "SciFi", "Ecchi"].map(
                              (genre, index2) => (
                                <option value={genre} key={index2}>
                                  {genre}
                                </option>
                              )
                            )}
                          </Field>
                          {values.genres.length > 1 ? (
                            <CloseButton
                              alignSelf="center"
                              color="red.500"
                              onClick={() => remove(genreIndex)}
                            />
                          ) : null}
                          <FormErrorMessage>{errors.genres}</FormErrorMessage>
                        </Flex>
                      </FormControl>
                    ))}
                  </Flex>
                  <Button onClick={() => push({ genreId: "" })}>Add</Button>
                </>
              )}
            </FieldArray>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default GeneralInfoTab;

const getSeasons = () => {
  let yearList = [];
  const seasonList = ["Winter", "Spring", "Summer", "Fall"];
  let startDate = moment().add(3, "year");
  let endDate = moment([1950, 1]);
  while (endDate.diff(startDate, "years") <= 0) {
    seasonList.map((season) => {
      yearList.push(`${season} ${startDate.format("YYYY")}`);
    });
    startDate.subtract(1, "year");
  }
  return yearList;
};

const getYears = () => {
  let yearList = [];
  let startDate = moment().add(3, "year");
  let endDate = moment([1950, 1]);
  while (endDate.diff(startDate, "years") <= 0) {
    yearList.push(`${startDate.format("YYYY")}`);
    startDate.subtract(1, "year");
  }
  return yearList;
};

const getMonths = () => {
  const monthList = [];
  for (let i = 0; i < 12; i++) {
    monthList.push({ index: i, monthName: moment().month(i).format("MMM") });
  }
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
