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
import { useAdvanceFilterDataQuery, Season } from "@/graphql";
import { FieldArray, Form, Formik } from "formik";
import MultiSelect from "@/components/Common/MultiSelect";

interface Score {
  Min: number;
  Max: number;
}
interface SearchFilters {
  Genres: string[] | null;
  Year: number | null;
  Season: Season | null;
  Format: string[] | null;
  AiringStatus: string | null;
  StreamingOn: string[] | null;
  SourceMaterial: string | null;
  Producer: string[] | null;
  Studio: string[] | null;
  AgeRating: string[] | null;
  Score: Score | null;
  Tags: string[] | null;
}

let initialSearchFilters = {
  genres: [],
  year: null,
  season: null,
  mediaFormat: [],
  airingStatus: null,
  streamingOn: [],
  sourceMaterial: null,
  producer: [],
  studio: [],
  ageRating: [],
  score: null,
  tags: [],
};

const filterStyle = {
  advancedFilter: {
    marginBottom: "1",
    headingSize: "xs",
  },
};

const SearchFilter = () => {
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
    currentQueryParams["year"] = 2010;
    router.push({
      pathname: "/search",
      query: currentQueryParams,
    });
  }

  for (let i = 1900; i <= currentDate.getFullYear() + 3; i++) {
    yearsArray.push(i);
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
      onSubmit={(values) => console.log(values)}
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
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Year
              </Heading>
              <Select
                placeholder="Select"
                id="year"
                name="year"
                onChange={handleChange}
              >
                {yearsArray
                  .sort((a, b) => b - a)
                  .map((year, i) => (
                    <option key={i} value={year}>
                      {year}
                    </option>
                  ))}
              </Select>
            </GridItem>
            <GridItem>
              <Heading
                size={filterStyle.advancedFilter.headingSize}
                mb={filterStyle.advancedFilter.marginBottom}
              >
                Season
              </Heading>
              <Select
                placeholder="Select"
                id="season"
                name="season"
                onChange={handleChange}
              >
                <option value={Season.Winter}>Winter</option>
                <option value={Season.Spring}>Spring</option>
                <option value={Season.Summer}>Summer</option>
                <option value={Season.Fall}>Fall</option>
              </Select>
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
