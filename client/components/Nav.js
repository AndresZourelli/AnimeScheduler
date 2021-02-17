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
import { Image } from "@chakra-ui/react";
import NextLink from "next/link";

const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isSignedIn = false;
  const buttons = isSignedIn ? (
    <Button mr="3">Sign out</Button>
  ) : (
    <>
      <Button mr="3">Login</Button> <Button mr="3">Sign Up</Button>
    </>
  );
  return (
    <nav>
      <Flex
        m="2"
        p="2"
        layerStyle={colorMode === "light" ? "header_light" : "header_dark"}>
        <Box mr="4">
          <Image
            boxSize="40px"
            src="/coffee_jelly3.svg"
            alt="Coffee Jelly Logo"
          />
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
