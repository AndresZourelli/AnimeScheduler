import {
  Flex,
  Spacer,
  Link,
  useColorMode,
  IconButton,
  Text,
  Box,
  Heading,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <nav>
      <Flex m="2" p="2">
        <Box>
          <Heading size="md" mr="4">
            AnimeDB
          </Heading>
        </Box>
        <Box>
          <NextLink href="/">
            <Link mr="4">Home</Link>
          </NextLink>
          <NextLink href="/Anime">
            <Link>Anime</Link>
          </NextLink>
        </Box>
        <Spacer />
        <Box>
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          />
        </Box>
      </Flex>
    </nav>
  );
};

export default Nav;
