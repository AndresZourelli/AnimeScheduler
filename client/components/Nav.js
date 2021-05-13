import {
  Flex,
  Spacer,
  Link,
  useColorMode,
  IconButton,
  Button,
  Box,
  Heading,
  Center,
  InputGroup,
  InputLeftElement,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, Search2Icon } from "@chakra-ui/icons";
import NextLink from "next/link";
import ImageLoader from "./ImageLoader";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import debouce from "lodash";
import { useAuth } from "@/lib/authClient";

const SEARCH_FOR_ANIME = gql`
  query SearchForAnime(
    $SearchInput: String!
    $PageInput: Int
    $LimitInput: Int
  ) {
    getAnimes(search: $SearchInput, page: $PageInput, limit: $LimitInput) {
      animes {
        title
        image_url
        avg_score
        id: _id
      }
    }
  }
`;

const Nav = () => {
  const [search, setSearch] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [searchAnimes, { loading, data }] = useLazyQuery(SEARCH_FOR_ANIME);
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
        Welcome, {user.username}
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
    searchAnimes({
      variables: { SearchInput: search, PageInput: 1, LimitInput: 6 },
    });
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
    if (user.userId) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, [user]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Box>
      <Flex
        m="2"
        p="2"
        layerStyle={colorMode === "light" ? "header_light" : "header_dark"}>
        <Box mr="4" width="40px" height="40px" position="relative">
          <ImageLoader
            image_url="/coffee_jelly3.svg"
            alt="Coffee Jelly Logo"></ImageLoader>
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
            gutter="0">
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
                />
              </InputGroup>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>Search Results</PopoverHeader>

              {loading ? (
                <PopoverBody m="auto">
                  <Spinner size="xl"></Spinner>
                </PopoverBody>
              ) : (
                <PopoverBody>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Results</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.getAnimes?.animes.map((anime) => {
                        return (
                          <Tr
                            key={anime.id}
                            _hover={{
                              background: "blue.600",
                              color: "blue.50",
                            }}>
                            <Td onClick={onPopoverClose}>
                              <NextLink href={`/anime/${anime.id}`}>
                                {anime.title}
                              </NextLink>
                            </Td>
                            <Td display="relative">
                              <Box w="70px" h="100px" position="relative">
                                <ImageLoader
                                  image_url={anime.image_url}
                                  alt={anime.title}
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
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          />
        </Box>
      </Flex>
      <Flex
        layerStyle={colorMode === "light" ? "navbar_light" : "navbar_dark"}
        justifyContent="center">
        <Center>
          <NextLink href="/">
            <Link mr="4">Home</Link>
          </NextLink>
          <NextLink Link href="/Anime">
            <Link mr="4">Animé</Link>
          </NextLink>
          {signedIn ? (
            <>
              <NextLink href="/anime/myanimes">
                <Link mr="4">My Animes</Link>
              </NextLink>
              <NextLink href="/user/account">
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
