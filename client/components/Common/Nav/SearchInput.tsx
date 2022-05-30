import { ArrowForwardIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Popover,
  PopoverTrigger,
  InputGroup,
  InputLeftElement,
  Input,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Spinner,
  Table,
  Tbody,
  Tr,
  Td,
  useOutsideClick,
  Stack,
  LinkOverlay,
  LinkBox,
  Text,
  Flex,
  Link,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ImageLoader from "../ImageLoader";
import NextLink from "next/link";
import { useSearchAnimesQuery } from "@/graphql";
import router from "next/router";
import { debounce } from "lodash";
import LoadImage from "@/components/Common/ImageLoader";

interface Search {
  variables?: Variable;
}
interface Variable {
  SearchInput: string;
  EndCursor: string;
  LimitInput: number;
}
const SearchInput = () => {
  const ref = useRef();
  useOutsideClick({
    ref: ref,
    handler: () => setOpenPopover(false),
  });
  const [openPopover, setOpenPopover] = useState(false);
  const [searchAnimes, setSearchAnimes] = useState<Search>({
    variables: { EndCursor: null, LimitInput: 4, SearchInput: null },
  });
  const [search, setSearch] = useState("");

  const [searchResult, searchQuery] = useSearchAnimesQuery({
    variables: {
      searchInput: search,
      after: searchAnimes.variables.EndCursor,
      first: searchAnimes.variables.LimitInput,
    },
    pause: true,
  });

  const onPopoverClose = () => {
    setOpenPopover(false);
    setSearch("");
  };

  const updateQuery = () => {
    searchQuery();
    setOpenPopover(true);
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (search !== "") {
        router.push({
          pathname: "/search",
          query: { q: search },
        });
        setSearch("");
        setOpenPopover(false);
      }
    }
  };

  const mobileSearch = () => {
    if (search !== "") {
      router.push({
        pathname: "/search",
        query: { q: search },
      });
      setSearch("");
      setOpenPopover(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(debounce(updateQuery, 500), [search]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    if (search) {
      delayedSearch();
    }
    return delayedSearch.cancel;
  }, [search, delayedSearch]);
  return (
    <Box w="300px" minW="300px" mr="3">
      <Stack display={{ base: "flex", md: "none" }}>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<Search2Icon />} />
          <Input
            placeholder="Search"
            value={search}
            onChange={onSearchChange}
            onKeyPress={onKeyPress}
          />
        </InputGroup>
        {searchResult.fetching ? (
          <Box m="auto" w="full">
            <Spinner size="xl" />
          </Box>
        ) : (
          <>
            <Box>
              Animes Found: {searchResult?.data?.searchAnimes.totalCount ?? 0}
            </Box>
            {searchResult?.data?.searchAnimes?.nodes.map((item) => (
              <LinkBox key={item.id}>
                <Flex gap={6}>
                  <LoadImage
                    image_url={item.coverImage}
                    alt={item.title}
                    maxW="100px"
                    w="100px"
                    borderRadius="lg"
                    overflow="hidden"
                  />
                  <Box w="100px" flexGrow={1}>
                    <Text>
                      <NextLink href={`/animes/${item.id}`}>
                        <LinkOverlay>{item.title}</LinkOverlay>
                      </NextLink>
                    </Text>
                  </Box>
                </Flex>
              </LinkBox>
            ))}
          </>
        )}
        {searchResult?.data?.searchAnimes.nodes.length > 0 ? (
          <LinkBox
            display="flex"
            alignItems="center"
            justifyContent="end"
            onClick={mobileSearch}
          >
            <LinkOverlay>
              <Text>View more search results</Text>
            </LinkOverlay>
            <ArrowForwardIcon boxSize="25px" />
          </LinkBox>
        ) : null}
      </Stack>
      <Box display={{ base: "none", md: "flex" }}>
        <Popover
          isOpen={openPopover}
          onClose={onPopoverClose}
          placement="bottom"
          autoFocus={false}
          gutter={0}
          closeOnBlur={true}
        >
          <PopoverTrigger>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon />}
              />
              <Input
                placeholder="Search"
                value={search}
                onChange={onSearchChange}
                onKeyPress={onKeyPress}
              />
            </InputGroup>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              Total found: {searchResult?.data?.searchAnimes?.totalCount ?? 0}
            </PopoverHeader>

            {searchResult.fetching ? (
              <PopoverBody m="auto">
                <Spinner size="xl" />
              </PopoverBody>
            ) : (
              <PopoverBody>
                <Table>
                  <Tbody>
                    {searchResult?.data?.searchAnimes.nodes.map((anime) => {
                      return (
                        <Tr
                          key={anime.id}
                          _hover={{
                            background: "blue.600",
                            color: "blue.50",
                          }}
                        >
                          <Td onClick={onPopoverClose}>
                            <NextLink href={`/animes/${anime.id}`}>
                              {anime.title}
                            </NextLink>
                          </Td>
                          <Td display="relative">
                            <Box w="70px" h="100px" position="relative">
                              <ImageLoader
                                image_url={anime.coverImage}
                                alt={anime.title}
                                maxW="70px"
                                minH="100px"
                              />
                            </Box>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </PopoverBody>
            )}
          </PopoverContent>
        </Popover>
      </Box>
    </Box>
  );
};

export default SearchInput;
