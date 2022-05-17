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
  Tr,
  useColorMode,
  useOutsideClick,
} from "@chakra-ui/react";
import debouce from "lodash";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  redirectToAuth,
  signOut,
} from "supertokens-auth-react/recipe/emailpassword";
import NotificationMenu from "@/components/Common/Nav/NotificationMenu";
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
  const { user, removeUserInfo } = useAuth();
  const [signedIn, setSignedIn] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(true);

  const handleLoginClick = () => {
    redirectToAuth({ show: "signin" });
  };

  const handleSignUpClick = () => {
    redirectToAuth({ show: "signup" });
  };

  const hangleSignOutClick = async () => {
    removeUserInfo();
    await signOut();
    router.push("/");
  };

  const buttons = signedIn ? (
    <>
      <Text alignSelf="center">Welcome, {user?.username}</Text>
      <Button onClick={hangleSignOutClick}>Sign out</Button>
    </>
  ) : (
    <>
      <Button onClick={handleLoginClick}>Login</Button>{" "}
      <Button onClick={handleSignUpClick}>Sign Up</Button>
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (user.loggedIn) {
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
          query: { q: search },
        });
        setSearch("");
        setOpenPopover(false);
      }
    }
  };

  useEffect(() => {
    if (router.pathname === "/search") {
      setSearchBarVisible(false);
    } else {
      setSearchBarVisible(true);
    }
  }, [router]);

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
            w="40px"
            h="40px"
            maxW="40px"
            minH="40px"
          />
        </Box>
        <Box>
          <Heading mr="4" color="accent_color">
            <NextLink href="/">AniCafé</NextLink>
          </Heading>
        </Box>
        <Spacer />
        {searchBarVisible ? (
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
                  Total found:{" "}
                  {searchResult?.data?.searchAnimes?.totalCount ?? 0}
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
        ) : null}

        <Flex gap={3}>
          {buttons}
          {signedIn ? <NotificationMenu /> : null}
          <IconButton
            aria-label="color mode button"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          />
        </Flex>
      </Flex>
      <Flex
        layerStyle={colorMode === "light" ? "navbar_light" : "navbar_dark"}
        justifyContent="center"
      >
        <Center>
          <NextLink href="/">
            <Link mr="4">Home</Link>
          </NextLink>
          <NextLink href="/animes/weekly">
            <Link mr="4">Airing This Week</Link>
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
