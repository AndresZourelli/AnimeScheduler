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
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import ImageLoader from "./ImageLoader";
import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const isSignedIn = false;

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignUpClick = () => {
    router.push("/signup");
  };

  const buttons = isSignedIn ? (
    <Button mr="3">Sign out</Button>
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

  return (
    <nav>
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
            animé café
          </Heading>
        </Box>
        <Spacer />
        <Box>
          {buttons}
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          />
        </Box>
      </Flex>
      <Flex>
        <Center
          layerStyle={colorMode === "light" ? "navbar_light" : "navbar_dark"}>
          <NextLink href="/">
            <Link mr="4">Home</Link>
          </NextLink>
          <NextLink href="/Anime">
            <Link>Animé</Link>
          </NextLink>
        </Center>
      </Flex>
    </nav>
  );
};

export default Nav;
