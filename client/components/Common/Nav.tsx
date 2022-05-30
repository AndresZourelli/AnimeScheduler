import ImageLoader from "@/components/Common/ImageLoader";
import MobileNavbar from "@/components/Common/Nav/MobileNavbar";
import NotificationMenu from "@/components/Common/Nav/NotificationMenu";
import { useAuth } from "@/lib/Auth/Auth";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Link,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  redirectToAuth,
  signOut,
} from "supertokens-auth-react/recipe/emailpassword";
import SearchInput from "./Nav/SearchInput";

const Nav = () => {
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

  useEffect(() => {
    if (user.loggedIn) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, [user]);

  const linkFilter = (item: LinkItem): boolean => {
    if (!item.logginOnly) {
      return true;
    }

    if (item.logginOnly && user.loggedIn) {
      return true;
    }
    return false;
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
      <MobileNavbar linkList={LinkData.links.filter(linkFilter)} />
      <Flex
        m="2"
        p="2"
        layerStyle={colorMode === "light" ? "header_light" : "header_dark"}
        wrap="wrap"
        display={{ base: "none", md: "flex" }}
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
            <NextLink href="/" passHref>
              <Link mr="4">AniCafé</Link>
            </NextLink>
          </Heading>
        </Box>
        <Spacer />
        {searchBarVisible ? <SearchInput /> : null}

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
        display={{ base: "none", md: "flex" }}
      >
        <Center>
          {LinkData.links.filter(linkFilter).map((item) => (
            <NextLink key={item.link} href={item.link} passHref>
              <Link mr="4">{item.linkName}</Link>
            </NextLink>
          ))}
        </Center>
      </Flex>
    </Box>
  );
};

export interface LinkItem {
  linkName: string;
  link: string;
  logginOnly: boolean;
}
interface LinkData {
  links: LinkItem[];
}
const LinkData: LinkData = {
  links: [
    {
      linkName: "Home",
      link: "/",
      logginOnly: false,
    },
    {
      linkName: "Airing This Week",
      link: "/animes/weekly",
      logginOnly: false,
    },
    {
      linkName: "My Animes",
      link: "/animes/myanimes",
      logginOnly: true,
    },
    {
      linkName: "My Account",
      link: "/users/account",
      logginOnly: true,
    },
  ],
};

export default Nav;
