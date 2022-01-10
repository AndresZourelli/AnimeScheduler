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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAdvanceFilterDataQuery, Season } from "@/graphql";

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

  return (
    <Grid
      templateColumns="repeat(auto-fit, minmax(12rem, 1fr))"
      gap={6}
      px="56"
    >
      <GridItem>
        <Heading
          size={filterStyle.advancedFilter.headingSize}
          mb={filterStyle.advancedFilter.marginBottom}
        >
          Genres
        </Heading>
        <Select placeholder="Select">
          {advancedFilterFields?.data?.genres?.nodes?.map((genreItem, i) => (
            <option key={i} value={genreItem.genre.toLowerCase()}>
              {genreItem.genre}
            </option>
          ))}
        </Select>
      </GridItem>
      <GridItem>
        <Heading
          size={filterStyle.advancedFilter.headingSize}
          mb={filterStyle.advancedFilter.marginBottom}
        >
          Year
        </Heading>
        <Select placeholder="Select">
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
        <Select placeholder="Select">
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
        <Select placeholder="Select">
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
        <Select placeholder="Select">
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
      <GridItem>
        <Heading
          size={filterStyle.advancedFilter.headingSize}
          mb={filterStyle.advancedFilter.marginBottom}
        >
          Streaming On
        </Heading>
        <Select placeholder="Select">
          <option>Test</option>
        </Select>
      </GridItem>
      <GridItem>
        <Heading
          size={filterStyle.advancedFilter.headingSize}
          mb={filterStyle.advancedFilter.marginBottom}
        >
          Source Material
        </Heading>
        <Select placeholder="Select">
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
        <Select placeholder="Select">
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
        <Select placeholder="Select">
          {advancedFilterFields?.data?.studios?.nodes?.map((studioItem, i) => (
            <option key={i} value={studioItem.studio.toLowerCase()}>
              {studioItem.studio}
            </option>
          ))}
        </Select>
      </GridItem>
      <GridItem>
        <Heading
          size={filterStyle.advancedFilter.headingSize}
          mb={filterStyle.advancedFilter.marginBottom}
        >
          Age Rating
        </Heading>
        <Select placeholder="Select">
          {advancedFilterFields?.data?.ageRatings?.nodes?.map(
            (ageRatingItem, i) => (
              <option key={i} value={ageRatingItem.ageRatingType.toLowerCase()}>
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
            onChange={(val) => setRange(val)}
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
        <Input placeholder="Select" />
      </GridItem>
    </Grid>
  );
};

export default SearchFilter;
