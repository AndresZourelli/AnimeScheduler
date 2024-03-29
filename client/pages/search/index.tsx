import {
  Box,
  Input,
  Flex,
  InputGroup,
  InputRightElement,
  Icon,
  Button,
  Collapse,
  Grid,
  Spinner,
  GridItem,
} from "@chakra-ui/react";
import { useSearchAnimesQuery, SearchResultFilter } from "@/graphql";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import SearchFilter, { SearchFilters } from "@/components/Search/SearchFilter";

import AnimeCard from "@/components/Home/AnimeCard";

import SearchResult from "@/components/Search/SearchResult";
import SearchBar from "@/components/Search/SearchBar";
import { stringify, parse } from "qs";
import { useUrlSearchParams } from "@/lib/zustand/state";

export interface SearchFilterExtended extends SearchFilters {
  q?: string;
}

const Search = () => {
  const [showAdvfilter, setShowAdvFilter] = useState(false);
  const [queryString, setQueryString] = useState({});
  const [searchFilter, setSearchFilter] = useState<SearchResultFilter>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [urlSearchParams, setUrlSearchParams] = useState<SearchFilterExtended>(
    {}
  );

  const [searchResult, querySearch] = useSearchAnimesQuery({
    variables: {
      searchInput: searchQuery,
      filter: searchFilter,
      first: 15,
    },
  });

  const onClickAdvFilter = () => {
    setShowAdvFilter(!showAdvfilter);
  };

  useEffect(() => {
    if (!isObjEmpty(searchFilter)) {
      querySearch();
      setShowAdvFilter(true);
    }
  }, [searchFilter, searchQuery, querySearch]);

  useEffect(() => {
    let url = window.location.search;
    let cleanedUrl = url.replace("?", "");
    const parsedUrl = parse(cleanedUrl);
    setUrlSearchParams({ ...urlSearchParams, ...parsedUrl });
  }, [setUrlSearchParams]);

  return (
    <Box p="5">
      <Flex py="5" justifyContent="center">
        <Box>
          <SearchBar
            querySearch={setSearchQuery}
            setUrlSearchParams={setUrlSearchParams}
            urlSearchParams={urlSearchParams}
          />
          <Button float="right" size="sm" onClick={onClickAdvFilter}>
            {showAdvfilter ? "Hide" : "Show"} Advanced Filter
          </Button>
        </Box>
      </Flex>
      <Collapse in={showAdvfilter} animateOpacity>
        <SearchFilter
          searchFilter={setSearchFilter}
          querySearch={setSearchQuery}
          setUrlSearchParams={setUrlSearchParams}
          urlSearchParams={urlSearchParams}
        />
      </Collapse>
      <Box mt="8">
        <SearchResult
          isLoading={searchResult.fetching}
          searchResult={searchResult?.data?.searchAnimes?.nodes}
        />
      </Box>
    </Box>
  );
};

export default Search;

const isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};
