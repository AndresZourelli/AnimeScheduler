import ImageLoader from "@/components/Common/ImageLoader";
import { useSearchAnimesQuery } from "@/graphql";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { MoonIcon, Search2Icon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useOutsideClick,
} from "@chakra-ui/react";
import debouce from "lodash";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, useRef } from "react";

interface Search {
  variables?: Variable;
}
interface Variable {
  SearchInput: string;
  EndCursor: string;
  LimitInput: number;
}
const Nav = () => {
  const ref = useRef();
  useOutsideClick({
    ref: ref,
    handler: () => setOpenPopover(false),
  });
  const [searchAnimes, setSearchAnimes] = useState<Search>({
    variables: { EndCursor: null, LimitInput: 4, SearchInput: null },
  });
  const [search, setSearch] = useState("");
  const [openPopover, setOpenPopover] = useState(false);

  const [searchResult, searchQuery] = useSearchAnimesQuery({
    variables: {
      searchInput: search,
      after: searchAnimes.variables.EndCursor,
      first: searchAnimes.variables.LimitInput,
    },
    pause: true,
  });

  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logoutUser } = useAuth();
  const [signedIn, setSignedIn] = useState(false);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignUpClick = () => {
    router.push("/signup");
  };

  const hangleSignOutClick = () => {
    logoutUser();
  };

  const buttons = signedIn ? (
    <>
      <Text display="inline-flex" mr="3">
        Welcome, {user?.username}
      </Text>
      <Button onClick={hangleSignOutClick} mr="3">
        Sign out
      </Button>
    </>
  ) : (
    <>
      <Button mr="3" onClick={handleLoginClick}>
        Login
      </Button>{" "}
      <Button mr="3" onClick={handleSignUpClick}>
        Sign Up
      </Button>
    </>
  );

  const onPopoverClose = () => {
    setOpenPopover(false);
    setSearch("");
  };

  const updateQuery = () => {
    searchQuery();
    setOpenPopover(true);
  };
  const delayedSearch = useCallback(debouce.debounce(updateQuery, 500), [
    search,
  ]);

  useEffect(() => {
    if (search) {
      delayedSearch();
    }
    return delayedSearch.cancel;
  }, [search, delayedSearch]);

  useEffect(() => {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, [user]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (search !== "") {
        router.push({
          pathname: "/search",
          query: { search },
        });
      }
    }
  };

  return (
    <Box>
      <Flex
        m="2"
        p="2"
        layerStyle={colorMode === "light" ? "header_light" : "header_dark"}
      >
        <Box mr="4" width="40px" height="40px" position="relative">
          <ImageLoader
            image_url="/coffee_jelly3.svg"
            alt="Coffee Jelly Logo"
            maxW="40px"
            minH="40px"
          />
        </Box>
        <Box>
          <Heading size="md" mr="4" textStyle="h2">
            <NextLink href="/">animé café</NextLink>
          </Heading>
        </Box>
        <Spacer />
        <Box w="300px" mr="3">
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
        <Box>
          {buttons}
          <IconButton
            aria-label="color mode button"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          />
        </Box>
      </Flex>
      <Flex
        layerStyle={colorMode === "light" ? "navbar_light" : "navbar_dark"}
        justifyContent="center"
      >
        <Center>
          <NextLink href="/">
            <Link mr="4">Home</Link>
          </NextLink>
          <NextLink href="/animes">
            <Link mr="4">Animés</Link>
          </NextLink>
          {signedIn ? (
            <>
              <NextLink href="/animes/myanimes">
                <Link mr="4">My Animes</Link>
              </NextLink>
              <NextLink href="/users/account">
                <Link>My Account</Link>
              </NextLink>
            </>
          ) : null}
        </Center>
      </Flex>
    </Box>
  );
};

export default Nav;
