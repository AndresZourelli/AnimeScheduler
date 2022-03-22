import {
  Box,
  InputGroup,
  Input,
  Button,
  Icon,
  InputRightElement,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import { SearchResultFilter } from "@/graphql";
import { stringify, parse } from "qs";
import { useUrlSearchParams } from "@/lib/zustand/state";

const SearchBar = ({ querySearch }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const urlSearchParams = useUrlSearchParams((state) => state.urlSearchParams);
  const addSearchQuery = useUrlSearchParams((state) => state.addSearchQuery);
  const addFilterParams = useUrlSearchParams((state) => state.addFilterParams);
  const addUrlSearchParams = useUrlSearchParams(
    (state) => state.addUrlSearchParams
  );

  const onChangeSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const callApi = () => {
    querySearch(searchQuery);
    addSearchQuery(searchQuery);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(debounce(callApi, 500), [searchQuery]);

  useEffect(() => {
    console.log(urlSearchParams);
    const cleanedObj = removeEmptyString(urlSearchParams);

    if (!isObjEmpty(urlSearchParams)) {
      if (!isObjEmpty(cleanedObj)) {
        history.replaceState(
          null,
          "",
          stringify(cleanedObj, { addQueryPrefix: true })
        );
        setSearchQuery(cleanedObj?.q);
      } else {
        history.replaceState(null, "", location.pathname);
      }
    }
  }, [urlSearchParams]);

  useEffect(() => {
    delayedSearch();
    return delayedSearch.cancel;
  }, [searchQuery, delayedSearch]);

  return (
    <Box>
      <InputGroup w="30rem" mb="2">
        <Input
          placeholder="Search"
          onChange={onChangeSearchQuery}
          value={searchQuery}
        />
        <InputRightElement children={<Icon as={FaSearch} />} />
      </InputGroup>
    </Box>
  );
};

export default SearchBar;

const isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const removeEmptyString = (obj) => {
  const newObj = { ...obj };
  for (const key of Object.keys(newObj)) {
    if (newObj[key] === "") {
      delete newObj[key];
    }
  }

  return newObj;
};
