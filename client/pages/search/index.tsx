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
import SearchFilter from "@/components/Search/SearchFilter";

import AnimeCard from "@/components/Home/AnimeCard";

import SearchResult from "@/components/Search/SearchResult";
import SearchBar from "@/components/Search/SearchBar";
import { stringify, parse } from "qs";
import { useUrlSearchParams } from "@/lib/zustand/state";

const Search = () => {
  const [showAdvfilter, setShowAdvFilter] = useState(false);
  const [queryString, setQueryString] = useState({});
  const [searchFilter, setSearchFilter] = useState<SearchResultFilter>({});
  const [searchQuery, setSearchQuery] = useState("");

  const urlSearchParams = useUrlSearchParams((state) => state.urlSearchParams);
  const addSearchQuery = useUrlSearchParams((state) => state.addSearchQuery);
  const addFilterParams = useUrlSearchParams((state) => state.addFilterParams);
  const addUrlSearchParams = useUrlSearchParams(
    (state) => state.addUrlSearchParams
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
    console.log(parsedUrl);
    addUrlSearchParams(parsedUrl);
  }, [addUrlSearchParams]);

  return (
    <Box p="5">
      <Flex py="5" justifyContent="center">
        <Box>
          <SearchBar querySearch={setSearchQuery} />
          <Button float="right" size="sm" onClick={onClickAdvFilter}>
            {showAdvfilter ? "Hide" : "Show"} Advanced Filter
          </Button>
        </Box>
      </Flex>
      <Collapse in={showAdvfilter} animateOpacity>
        <SearchFilter
          searchFilter={setSearchFilter}
          querySearch={setSearchQuery}
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
