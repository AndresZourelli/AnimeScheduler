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
import { FaSearch } from "react-icons/fa";
import AnimeCard from "@/components/Home/AnimeCard";
import { debounce } from "lodash";
import SearchResult from "@/components/Search/SearchResult";

const Search = () => {
  const router = useRouter();

  const [showAdvfilter, setShowAdvFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchResultFilter>({});
  const [searchResult, querySearch] = useSearchAnimesQuery({
    variables: {
      searchInput: searchQuery,
      filter: searchFilter,
      first: 15,
    },
    pause: true,
  });
  const { search } = router.query;

  const onClickAdvFilter = () => {
    setShowAdvFilter(!showAdvfilter);
  };

  const onChangeSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const callApi = () => {
    querySearch();
  };

  const delayedSearch = useCallback(debounce(callApi, 500), [searchQuery]);

  useEffect(() => {
    if (search) {
      setSearchQuery(search as string);
    }
  }, [search]);

  useEffect(() => {
    if (searchQuery || searchQuery === "") {
      delayedSearch();
    }
    return delayedSearch.cancel;
  }, [searchQuery, delayedSearch]);

  useEffect(() => {
    if (searchFilter !== {}) {
      querySearch();
    }
  }, [searchFilter, querySearch]);

  return (
    <Box p="5">
      <Flex py="5" justifyContent="center">
        <Box>
          <InputGroup w="30rem" mb="2">
            <Input
              placeholder="Search"
              onChange={onChangeSearchQuery}
              value={searchQuery}
            />
            <InputRightElement children={<Icon as={FaSearch} />} />
          </InputGroup>
          <Button float="right" size="sm" onClick={onClickAdvFilter}>
            {showAdvfilter ? "Hide" : "Show"} Advanced Filter
          </Button>
        </Box>
      </Flex>
      <Collapse in={showAdvfilter} animateOpacity>
        <SearchFilter searchFilter={setSearchFilter} />
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
