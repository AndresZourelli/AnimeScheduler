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
import React, { useEffect, useMemo, useState } from "react";
import {
  useAdvanceFilterDataQuery,
  Season,
  SearchResultFilter,
  StringListFilter,
} from "@/graphql";
import { FieldArray, Form, Formik } from "formik";
import MultiSelect from "@/components/Common/MultiSelect";
import { stringify, parse } from "qs";

interface Score {
  min: number;
  max: number;
}

interface Options {
  name: string;
  value: string | number;
}
interface SearchFilters {
  genres: string[];
  year: string[];
  season: string[];
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
  let searchResultFilters: SearchResultFilter = {};
  if (value.ageRating.length > 0) {
    searchResultFilters["ageRatingType"] = {
      in: value.ageRating.map((item) => item as string),
    };
  }

  if (value.airingStatus.length > 0) {
    searchResultFilters.airingStatusType = {
      in: value.airingStatus.map((item) => item as string),
    };
  }

  if (value.genres.length > 0) {
    searchResultFilters["genres"] = {
      contains: value.genres.map((item) => item as string),
    };
  }

  if (value.mediaFormat.length > 0) {
    searchResultFilters.mediaType = {
      in: value.mediaFormat.map((item) => item as string),
    };
  }

  if (value.producer.length > 0) {
    searchResultFilters.producers = {
      contains: value.producer.map((item) => item as string),
    };
  }

  if (value.score.min !== 0 || value.score.max !== 10) {
    searchResultFilters.averageWatcherRating = {
      greaterThanOrEqualTo: value.score.min,
      lessThanOrEqualTo: value.score.max,
    };
  }

  if (value.season.length > 0) {
    searchResultFilters.season = {
      in: value.season.map((item) => item as string),
    };
  }

  if (value.sourceMaterial.length > 0) {
    searchResultFilters.sourceMaterialType = {
      in: value.sourceMaterial.map((item) => item as string),
    };
  }

  if (value.streamingOn.length > 0) {
    searchResultFilters.streamingOn = { in: value.streamingOn };
  }

  if (value.studio.length > 0) {
    searchResultFilters.studios = {
      contains: value.studio.map((item) => item as string),
    };
  }
  if (value.year.length > 0) {
    searchResultFilters.seasonYear = {
      in: value.year.map((item) => Number(item) as number),
    };
  }

  return searchResultFilters;
};

interface MultiSelectItems {
  name: string;
  title: string;
  inputArray: Options[];
}

const SearchFilter = (props: SearchProps) => {
  const { searchFilter } = props;
  const router = useRouter();
  const [range, setRange] = useState([0, 10]);
  const [advancedFilterFields, _] = useAdvanceFilterDataQuery();

  let currentQueryParams = {};
  if (Object.keys(router.query).length > 0) {
    currentQueryParams = router.query;
  }

  let initialSearchFilters2 = {
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

  let genreOptions: Options[] = [];
  let formatOptions: Options[] = [];
  let airingOptions: Options[] = [];
  let sourceOptions: Options[] = [];
  let producerOptions: Options[] = [];
  let studioOptions: Options[] = [];
  let ageOptions: Options[] = [];
  let tagOptions: Options[] = [];

  let yearsArray = [];
  const currentDate = new Date();
  for (let i = currentDate.getFullYear() + 3; i >= 1900; i--) {
    yearsArray.push({ name: i.toString(), value: i });
  }

  let multiSelectItems: MultiSelectItems[] = useMemo(
    () => [
      {
        name: "genres",
        title: "Genres",
        inputArray: genreOptions,
      },
      {
        name: "year",
        title: "Year",
        inputArray: yearsArray,
      },
      {
        name: "season",
        title: "Season",
        inputArray: seasonArray,
      },
      {
        name: "mediaFormat",
        title: "Format",
        inputArray: formatOptions,
      },
      {
        name: "airingStatus",
        title: "Airing Status",
        inputArray: airingOptions,
      },
      {
        name: "sourceMaterial",
        title: "Source Material",
        inputArray: sourceOptions,
      },
      {
        name: "producer",
        title: "Producer",
        inputArray: producerOptions,
      },
      {
        name: "studio",
        title: "Studio",
        inputArray: studioOptions,
      },
      {
        name: "ageRating",
        title: "Age Rating",
        inputArray: ageOptions,
      },
    ],
    []
  );
  useEffect(() => {
    if (
      !advancedFilterFields.fetching &&
      advancedFilterFields?.data?.genres?.nodes
    ) {
      advancedFilterFields?.data?.genres?.nodes.map((item) => {
        genreOptions.push({
          name: item.genre,
          value: item.genre,
        });
      });
    }
    if (
      !advancedFilterFields.fetching &&
      advancedFilterFields?.data?.mediaFormats?.nodes
    ) {
      advancedFilterFields?.data?.mediaFormats?.nodes.map((item) => {
        formatOptions.push({ name: item.mediaType, value: item.mediaType });
      });
    }

    if (
      !advancedFilterFields.fetching &&
      advancedFilterFields?.data?.airingStatuses?.nodes
    ) {
      advancedFilterFields?.data?.airingStatuses?.nodes.map((item) => {
        airingOptions.push({
          name: item.airingStatusType,
          value: item.airingStatusType,
        });
      });
    }

    if (
      !advancedFilterFields.fetching &&
      advancedFilterFields?.data?.sourceMaterials?.nodes
    ) {
      advancedFilterFields?.data?.sourceMaterials?.nodes.map((item) => {
        sourceOptions.push({
          name: item.sourceMaterialType,
          value: item.sourceMaterialType,
        });
      });
    }

    if (
      !advancedFilterFields.fetching &&
      advancedFilterFields?.data?.producers?.nodes
    ) {
      advancedFilterFields?.data?.producers?.nodes.map((item) => {
        producerOptions.push({
          name: item.producer,
          value: item.producer,
        });
      });
    }
    if (
      !advancedFilterFields.fetching &&
      advancedFilterFields?.data?.studios?.nodes
    ) {
      advancedFilterFields?.data?.studios?.nodes.map((item) => {
        studioOptions.push({
          name: item.studio,
          value: item.studio,
        });
      });
    }
    if (
      !advancedFilterFields.fetching &&
      advancedFilterFields?.data?.ageRatings?.nodes
    ) {
      advancedFilterFields?.data?.ageRatings?.nodes.map((item) => {
        ageOptions.push({
          name: item.ageRatingType,
          value: item.ageRatingType,
        });
      });
    }
  });

  useEffect(() => {
    let url = window.location.search;
    let cleanedUrl = url.replace("?", "");
    const parsedUrl = parse(cleanedUrl);
    initialSearchFilters = Object.assign(initialSearchFilters, parsedUrl);
    if (parsedUrl["score"]) {
      setRange([
        Number(initialSearchFilters.score.min),
        Number(initialSearchFilters.score.max),
      ]);
    }
    searchFilter(generateFilters(initialSearchFilters));
  }, [searchFilter]);
  return (
    <Formik
      initialValues={initialSearchFilters}
      enableReinitialize={true}
      onSubmit={(values: SearchFilters) => {
        searchFilter(generateFilters(values));
        let queryParams = {};
        for (const param in values) {
          let value = [];
          if (Array.isArray(values[param])) {
            for (let i = 0; i < values[param].length; i++) {
              value.push(values[param][i]);
            }
            queryParams[param] = value;
          } else {
            queryParams[param] = values[param];
          }
        }
        history.replaceState(null, "", "?" + stringify(queryParams));
      }}
    >
      {({ values, handleChange, setFieldValue, resetForm }) => (
        <Form>
          <Grid
            templateColumns="repeat(auto-fit, minmax(12rem, 1fr))"
            gap={6}
            px="56"
          >
            {multiSelectItems.map((item, i) =>
              generateMultiSelectComp(
                item.name,
                item.title,
                item.inputArray,
                values,
                i
              )
            )}

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
                Score
              </Heading>
              <Flex px="4">
                <Box>{values.score.min}</Box>
                <RangeSlider
                  // eslint-disable-next-line jsx-a11y/aria-proptypes
                  aria-label={["min", "max"]}
                  defaultValue={[values.score.min, values.score.max]}
                  min={0}
                  max={10}
                  step={1}
                  onChangeEnd={(val) => {
                    setFieldValue("score.min", val[0]);
                    setFieldValue("score.max", val[1]);
                  }}
                  value={[values.score.min, values.score.max]}
                  mx="4"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Box>{values.score.max}</Box>
              </Flex>
            </GridItem>
            <GridItem>
              <FieldArray name="tags">
                {({ remove, push }) => (
                  <>
                    <Heading
                      size={filterStyle.advancedFilter.headingSize}
                      mb={filterStyle.advancedFilter.marginBottom}
                    >
                      Tags
                    </Heading>
                    <MultiSelect
                      itemOptions={tagOptions}
                      addSelectedItem={push}
                      removeSelectedItem={remove}
                      selectedItems={values.tags}
                    />
                  </>
                )}
              </FieldArray>
            </GridItem>
            <GridItem>
              <Button type="submit">Submit</Button>
              <Button
                type="reset"
                onClick={() => resetForm({ values: initialSearchFilters2 })}
              >
                Clear Filters
              </Button>
            </GridItem>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const generateMultiSelectComp = (
  fieldName: string,
  title: string,
  inputArray: Options[],
  values: any,
  key: number
) => {
  console.log("first");
  return (
    <GridItem key={key}>
      <FieldArray name={fieldName}>
        {({ remove, push }) => (
          <>
            <Heading
              size={filterStyle.advancedFilter.headingSize}
              mb={filterStyle.advancedFilter.marginBottom}
            >
              {title}
            </Heading>
            <MultiSelect
              itemOptions={inputArray}
              addSelectedItem={push}
              removeSelectedItem={remove}
              selectedItems={values[fieldName]}
            />
          </>
        )}
      </FieldArray>
    </GridItem>
  );
};

export default SearchFilter;
