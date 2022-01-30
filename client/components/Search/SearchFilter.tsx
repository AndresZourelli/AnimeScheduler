import {
  Box,
  Grid,
  Select,
  GridItem,
  Heading,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tooltip,
  RangeSliderMark,
  useRangeSlider,
  Flex,
  Input,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useAdvanceFilterDataQuery,
  Season,
  SearchResultFilter,
  StringListFilter,
} from "@/graphql";
import { FieldArray, Form, Formik } from "formik";
import MultiSelect from "@/components/Common/MultiSelect";

interface Score {
  min: number;
  max: number;
}

interface Options {
  name: string;
  value: string | number;
}
interface SearchFilters {
  genres: Options[];
  year: Options[];
  season: Options[];
  mediaFormat: string[];
  airingStatus: string[];
  streamingOn: string[];
  sourceMaterial: string[];
  producer: string[];
  studio: string[];
  ageRating: string[];
  score: Score;
  tags: string[];
}

interface SearchProps {
  searchFilter: (item: SearchResultFilter) => void;
}

const seasonArray = [
  { name: "Winter", value: "Winter" },
  { name: "Spring", value: "Spring" },
  { name: "Summer", value: "Summer" },
  { name: "Fall", value: "Fall" },
];

let initialSearchFilters = {
  genres: [],
  year: [],
  season: [],
  mediaFormat: [],
  airingStatus: [],
  streamingOn: [],
  sourceMaterial: [],
  producer: [],
  studio: [],
  ageRating: [],
  score: { min: 0, max: 10 },
  tags: [],
};

const filterStyle = {
  advancedFilter: {
    marginBottom: "1",
    headingSize: "xs",
  },
};

const generateFilters = (value: SearchFilters): SearchResultFilter => {
  let searchResultFilters: SearchResultFilter = {
    ageRatingType: { in: null },
    airingStatusType: { in: null },
    genres: { contains: null },
    mediaType: { in: null },
    producers: { contains: null },
    averageWatcherRating: {
      greaterThanOrEqualTo: null,
      lessThanOrEqualTo: null,
    },
    season: { in: null },
    sourceMaterialType: { in: null },
    streamingOn: { in: null },
    studios: { contains: null },
    seasonYear: { in: null },
  };
  if (value.ageRating.length > 0) {
    searchResultFilters.ageRatingType.in = value.ageRating;
  }

  if (value.airingStatus.length > 0) {
    searchResultFilters.airingStatusType.in = value.airingStatus;
  }

  if (value.genres.length > 0) {
    searchResultFilters.genres.contains = value.genres.map(
      (item) => item.value as string
    );
  }

  if (value.mediaFormat.length > 0) {
    searchResultFilters.mediaType.in = value.mediaFormat;
  }

  if (value.producer.length > 0) {
    searchResultFilters.producers.contains = value.producer;
  }

  if (value.score !== initialSearchFilters.score) {
    searchResultFilters.averageWatcherRating.greaterThanOrEqualTo =
      value.score[0];
    searchResultFilters.averageWatcherRating.lessThanOrEqualTo = value.score[1];
  }

  if (value.season.length > 0) {
    searchResultFilters.season.in = value.season.map(
      (item) => item.value as string
    );
  }

  if (value.sourceMaterial.length > 0) {
    searchResultFilters.sourceMaterialType.in = value.sourceMaterial;
  }

  if (value.streamingOn.length > 0) {
    searchResultFilters.streamingOn.in = value.streamingOn;
  }

  if (value.studio.length > 0) {
    searchResultFilters.studios.contains = value.studio;
  }

  if (value.year.length > 0) {
    searchResultFilters.seasonYear.in = value.year.map(
      (item) => item.value as number
    );
  }

  return searchResultFilters;
};

const SearchFilter = (props: SearchProps) => {
  const router = useRouter();
  const [range, setRange] = useState([0, 10]);
  const [advancedFilterFields, _] = useAdvanceFilterDataQuery();
  let yearsArray = [];
  const currentDate = new Date();
  let currentQueryParams = {};
  if (Object.keys(router.query).length > 0) {
    currentQueryParams = router.query;
  }

  if (!currentQueryParams.hasOwnProperty("year")) {
    currentQueryParams["year"] = [2010, 2012];
    router.push({
      pathname: "/search",
      query: currentQueryParams,
    });
  }

  for (let i = currentDate.getFullYear() + 3; i >= 1900; i--) {
    yearsArray.push({ name: i.toString(), value: i });
  }
  let availableTags = [];

  useEffect(() => {
    if (
      !advancedFilterFields.fetching &&
      advancedFilterFields?.data?.genres?.nodes
    ) {
      advancedFilterFields?.data?.genres?.nodes.map((item) => {
        availableTags.push({
          name: item.genre,
          value: item.genre,
        });
      });
    }
  });

  return (
    <Formik
      initialValues={initialSearchFilters}
      onSubmit={(values: SearchFilters) => {
        console.log(generateFilters(values));
        props.searchFilter(generateFilters(values));
      }}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <Grid
            templateColumns="repeat(auto-fit, minmax(12rem, 1fr))"
            gap={6}
            px="56"
          >
            <GridItem>
              <FieldArray name="genres">
                {({ remove, push }) => (
                  <>
                    <Heading
                      size={filterStyle.advancedFilter.headingSize}
                      mb={filterStyle.advancedFilter.marginBottom}
                    >
                      Genres
                    </Heading>
                    <MultiSelect
                      itemOptions={availableTags}
                      addSelectedItem={push}
                      removeSelectedItem={remove}
                      selectedItems={values.genres}
                    />
                  </>
                )}
              </FieldArray>
            </GridItem>
            <GridItem>
              <FieldArray name="year">
                {({ remove, push }) => (
                  <>
                    <Heading
                      size={filterStyle.advancedFilter.headingSize}
                      mb={filterStyle.advancedFilter.marginBottom}
                    >
                      Year
                    </Heading>
                    <MultiSelect
                      itemOptions={yearsArray}
                      addSelectedItem={push}
                      removeSelectedItem={remove}
                      selectedItems={values.year}
                    />
                  </>
                )}
              </FieldArray>
            </GridItem>
            <GridItem>
              <FieldArray name="season">
                {({ remove, push }) => (
                  <>
                    <Heading
                      size={filterStyle.advancedFilter.headingSize}
                      mb={filterStyle.advancedFilter.marginBottom}
                    >
                      Season
                    </Heading>
                    <MultiSelect
                      itemOptions={seasonArray}
                      addSelectedItem={push}
                      removeSelectedItem={remove}
                      selectedItems={values.season}
                    />
                  </>
                )}
              </FieldArray>
            </GridItem>
            <GridItem>
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Format
              </Heading>
              <Select
                placeholder="Select"
                id="mediaFormat"
                name="mediaFormat"
                onChange={handleChange}
              >
                {advancedFilterFields?.data?.mediaFormats?.nodes?.map(
                  (mediaItem, i) => (
                    <option key={i} value={mediaItem.mediaType.toLowerCase()}>
                      {mediaItem.mediaType}
                    </option>
                  )
                )}
              </Select>
            </GridItem>
            <GridItem>
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Airing Status
              </Heading>
              <Select
                placeholder="Select"
                id="airingStatus"
                name="airingStatus"
                onChange={handleChange}
              >
                {advancedFilterFields?.data?.airingStatuses?.nodes?.map(
                  (airingStatusItem, i) => (
                    <option
                      key={i}
                      value={airingStatusItem.airingStatusType.toLowerCase()}
                    >
                      {airingStatusItem.airingStatusType}
                    </option>
                  )
                )}
              </Select>
            </GridItem>
            <GridItem zIndex="1">
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Streaming On
              </Heading>
              <Select
                placeholder="Select"
                id="streamingOn"
                name="streamingOn"
                onChange={handleChange}
              >
                <option value="test">Test</option>
              </Select>
            </GridItem>
            <GridItem>
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Source Material
              </Heading>
              <Select
                placeholder="Select"
                id="sourceMaterial"
                name="sourceMaterial"
                onChange={handleChange}
              >
                {advancedFilterFields?.data?.sourceMaterials?.nodes?.map(
                  (sourceMaterialItem, i) => (
                    <option
                      key={i}
                      value={sourceMaterialItem.sourceMaterialType.toLowerCase()}
                    >
                      {sourceMaterialItem.sourceMaterialType}
                    </option>
                  )
                )}
              </Select>
            </GridItem>
            <GridItem>
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Producer
              </Heading>
              <Select
                placeholder="Select"
                id="producer"
                name="producer"
                onChange={handleChange}
              >
                {advancedFilterFields?.data?.producers?.nodes?.map(
                  (producerItem, i) => (
                    <option key={i} value={producerItem.producer.toLowerCase()}>
                      {producerItem.producer}
                    </option>
                  )
                )}
              </Select>
            </GridItem>
            <GridItem>
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Studio
              </Heading>
              <Select
                placeholder="Select"
                id="studio"
                name="studio"
                onChange={handleChange}
              >
                {advancedFilterFields?.data?.studios?.nodes?.map(
                  (studioItem, i) => (
                    <option key={i} value={studioItem.studio.toLowerCase()}>
                      {studioItem.studio}
                    </option>
                  )
                )}
              </Select>
            </GridItem>
            <GridItem>
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Age Rating
              </Heading>
              <Select
                placeholder="Select"
                id="ageRating"
                name="ageRating"
                onChange={handleChange}
              >
                {advancedFilterFields?.data?.ageRatings?.nodes?.map(
                  (ageRatingItem, i) => (
                    <option
                      key={i}
                      value={ageRatingItem.ageRatingType.toLowerCase()}
                    >
                      {ageRatingItem.ageRatingType}
                    </option>
                  )
                )}
              </Select>
            </GridItem>
            <GridItem>
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Score
              </Heading>
              <Flex px="4">
                <Box>{range[0]}</Box>
                <RangeSlider
                  // eslint-disable-next-line jsx-a11y/aria-proptypes
                  aria-label={["min", "max"]}
                  defaultValue={[0, 10]}
                  min={0}
                  max={10}
                  step={1}
                  onChange={(val) => {
                    setRange(val);
                  }}
                  onChangeEnd={(val) => setFieldValue("score", val)}
                  mx="4"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Box>{range[1]}</Box>
              </Flex>
            </GridItem>
            <GridItem>
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Tags
              </Heading>
              <Input
                placeholder="Select"
                id="tags"
                name="tags"
                onChange={handleChange}
              />
            </GridItem>
            <GridItem>
              <Button type="submit">Submit</Button>
            </GridItem>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default SearchFilter;
