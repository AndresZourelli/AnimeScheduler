import MultiSelectGridItem from "@/components/Common/MultiSelectGridItem";
import RatingRangeSlider from "@/components/Search/RatingRangeSlider";
import { SearchResultFilter, useAdvanceFilterDataQuery } from "@/graphql";
import { useUrlSearchParams } from "@/lib/zustand/state";
import { Button, Grid, GridItem, Heading, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { parse, stringify } from "qs";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { isEqual } from "lodash";

interface Score {
  min: number;
  max: number;
}

export interface Options {
  name: string;
  value: string | number;
}
export interface SearchFilters {
  genres?: string[];
  year?: string[];
  season?: string[];
  mediaFormat?: string[];
  airingStatus?: string[];
  streamingOn?: string[];
  sourceMaterial?: string[];
  producer?: string[];
  studio?: string[];
  ageRating?: string[];
  score?: Score;
  tags?: string[];
}

interface SearchProps {
  searchFilter: (item: SearchResultFilter) => void;
  querySearch: (item) => void;
}

interface SearchFiltersReactHookForm {
  genres?: Options[];
  year?: Options[];
  season?: Options[];
  mediaFormat?: Options[];
  airingStatus?: Options[];
  streamingOn?: Options[];
  sourceMaterial?: Options[];
  producer?: Options[];
  studio?: Options[];
  ageRating?: Options[];
  score?: Score;
  tags?: Options[];
}

const seasonArray = [
  { name: "Winter", value: "Winter" },
  { name: "Spring", value: "Spring" },
  { name: "Summer", value: "Summer" },
  { name: "Fall", value: "Fall" },
];

let initialSearchFilters: SearchFiltersReactHookForm = {
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

export const filterStyle = {
  advancedFilter: {
    marginBottom: "1",
    headingSize: "xs",
  },
};

const generateFilters = (value: SearchFilters): SearchResultFilter => {
  let searchResultFilters: SearchResultFilter = {};
  if (value?.ageRating?.length > 0) {
    searchResultFilters["ageRatingType"] = {
      in: value.ageRating.map((item) => item as string),
    };
  }

  if (value?.airingStatus?.length > 0) {
    searchResultFilters.airingStatusType = {
      in: value.airingStatus.map((item) => item as string),
    };
  }

  if (value?.genres?.length > 0) {
    searchResultFilters["genres"] = {
      contains: value.genres.map((item) => item as string),
    };
  }

  if (value?.mediaFormat?.length > 0) {
    searchResultFilters.mediaType = {
      in: value.mediaFormat.map((item) => item as string),
    };
  }

  if (value?.producer?.length > 0) {
    searchResultFilters.producers = {
      contains: value.producer.map((item) => item as string),
    };
  }

  if (
    value?.score &&
    (Number(value?.score?.min) !== 0 || Number(value?.score?.max) !== 10)
  ) {
    searchResultFilters.averageWatcherRating = {
      greaterThanOrEqualTo: value.score.min,
      lessThanOrEqualTo: value.score.max,
    };
  }

  if (value?.season?.length > 0) {
    searchResultFilters.season = {
      in: value.season.map((item) => item as string),
    };
  }

  if (value?.sourceMaterial?.length > 0) {
    searchResultFilters.sourceMaterialType = {
      in: value.sourceMaterial.map((item) => item as string),
    };
  }

  if (value?.streamingOn?.length > 0) {
    searchResultFilters.streamingOn = { in: value.streamingOn };
  }

  if (value?.studio?.length > 0) {
    searchResultFilters.studios = {
      contains: value.studio.map((item) => item as string),
    };
  }
  if (value?.year?.length > 0) {
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
  const { searchFilter, querySearch } = props;
  const router = useRouter();
  const [multiSelectItems, setMultiSelectItems] = useState<MultiSelectItems[]>(
    []
  );
  const [advancedFilterFields, _] = useAdvanceFilterDataQuery();
  const methods = useForm<SearchFiltersReactHookForm>({
    defaultValues: initialSearchFilters,
  });
  const {} = useFormState({ control: methods.control });
  const { register, handleSubmit, reset, formState } = methods;
  const urlSearchParams = useUrlSearchParams((state) => state.urlSearchParams);
  const addSearchQuery = useUrlSearchParams((state) => state.addSearchQuery);
  const addFilterParams = useUrlSearchParams((state) => state.addFilterParams);
  const addUrlSearchParams = useUrlSearchParams(
    (state) => state.addUrlSearchParams
  );

  const onSubmit = (data) => {
    let queryParams: SearchFilters = {};
    for (const param in data) {
      let value = [];
      if (Array.isArray(data[param])) {
        for (let i = 0; i < data[param].length; i++) {
          value.push(data[param][i].name);
        }
        queryParams[param] = value;
      } else {
        if (!isEqual(data[param], { min: 0, max: 10 })) {
          queryParams[param] = data[param];
        }
      }
    }
    const searchParams = { ...queryParams, q: urlSearchParams.q };
    addFilterParams(queryParams);
    history.replaceState(null, "", "?" + stringify(searchParams));
    searchFilter(generateFilters(queryParams));
  };

  const onReset = () => {
    reset(initialSearchFilters);
    searchFilter({});
    router.replace("/search", undefined, { shallow: true });
  };

  useEffect(() => {
    if (formState.isDirty) {
      onSubmit(methods.getValues());
    }
  }, [formState.isDirty]);

  useEffect(() => {
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

    let items: MultiSelectItems[] = [
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
      {
        name: "tags",
        title: "Tags",
        inputArray: tagOptions,
      },
    ];
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
    setMultiSelectItems(items);
  }, [advancedFilterFields?.data, advancedFilterFields?.fetching]);

  useEffect(() => {
    const combinedFiltersObject: SearchFiltersReactHookForm = {
      ...initialSearchFilters,
    };

    for (const key in urlSearchParams) {
      if (key != "q") {
        if (key == "score") {
          combinedFiltersObject[key] = {
            min: Number(urlSearchParams[key].min),
            max: Number(urlSearchParams[key].max),
          };
        } else {
          combinedFiltersObject[key] = urlSearchParams[key];
        }
      }
    }
    const generateReactHookFormDefaultValues = generateExistingFilters(
      combinedFiltersObject
    );
    searchFilter(generateFilters(urlSearchParams));
    querySearch(urlSearchParams?.q as any);
    reset(generateReactHookFormDefaultValues);
  }, [searchFilter, reset, querySearch, urlSearchParams]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          templateColumns="repeat(auto-fit, minmax(12rem, 1fr))"
          gap={6}
          px="56"
        >
          {multiSelectItems.map((item, i) => (
            <MultiSelectGridItem
              fieldName={item.name}
              title={item.title}
              inputArray={item.inputArray}
              key={item.name}
            />
          ))}

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
              {...register("streamingOn")}
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
            <RatingRangeSlider />
          </GridItem>

          <GridItem>
            {/* <Button type="submit">Submit</Button> */}
            <Button onClick={() => onReset()}>Clear Filters</Button>
          </GridItem>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default SearchFilter;

const generateExistingFilters = (data): SearchFiltersReactHookForm => {
  let queryParams: SearchFiltersReactHookForm = {};
  for (const param in data) {
    let value = [];
    if (Array.isArray(data[param])) {
      for (let i = 0; i < data[param].length; i++) {
        if (param === "year") {
          value.push({ name: data[param][i], value: Number(data[param][i]) });
        } else {
          value.push({ name: data[param][i], value: data[param][i] });
        }
      }
      queryParams[param] = value;
    } else {
      queryParams[param] = data[param];
    }
  }
  return queryParams;
};
