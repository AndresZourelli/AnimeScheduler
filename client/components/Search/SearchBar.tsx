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

const SearchBar = ({ querySearch, setUrlSearchParams, urlSearchParams }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const callApi = () => {
    querySearch(searchQuery);
    setUrlSearchParams({ ...urlSearchParams, q: searchQuery });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(debounce(callApi, 500), [searchQuery]);

  useEffect(() => {
    const cleanedObj = removeEmptyString(urlSearchParams);

    if (!isObjEmpty(urlSearchParams)) {
      if (!isObjEmpty(cleanedObj)) {
        router.replace(
          "/search" + stringify(cleanedObj, { addQueryPrefix: true }),
          undefined,
          {
            shallow: true,
          }
        );
        setSearchQuery(cleanedObj?.q);
      } else {
        router.replace("/search", undefined, {
          shallow: true,
        });
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
