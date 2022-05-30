import { Search2Icon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Input,
  Link,
  LinkBox,
  LinkOverlay,
  Spacer,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import ImageLoader from "../ImageLoader";
import NextLink from "next/link";
import { LinkItem } from "../Nav";
import { useRouter } from "next/router";
import SearchInput from "./SearchInput";
import { useEffect } from "react";

interface MobileNavbarProps {
  [x: string]: any;
  linkList: LinkItem[];
}
const MobileNavbar = ({ linkList, ...props }: MobileNavbarProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSearch,
    onOpen: onOpenSearch,
    onClose: onCloseSearch,
  } = useDisclosure();
  const router = useRouter();
  const sharedStyles = { bg: "accent_color", color: "mid_dark_grey" };
  useEffect(() => {
    if (isOpenSearch) {
      onCloseSearch();
    }
  }, [router.asPath]);

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [router.asPath]);
  return (
    <>
      <Flex
        margin="2"
        layerStyle={colorMode === "light" ? "header_light" : "header_dark"}
        wrap="wrap"
        display={{ base: "flex", md: "none" }}
        {...props}
      >
        <IconButton
          onClick={onOpen}
          aria-label="Navbar Menu"
          icon={<HamburgerIcon />}
        />
        <Spacer />
        <Flex>
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
        </Flex>
        <Spacer />
        <IconButton
          aria-label="search"
          onClick={onOpenSearch}
          icon={<Search2Icon />}
        />
      </Flex>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="3xl" as="h2">
            Navbar
          </DrawerHeader>

          <DrawerBody px="0">
            {linkList.map((item) => (
              <LinkBox key={item.link}>
                <Box
                  bg={router.asPath === item.link ? sharedStyles.bg : "unset"}
                  color={
                    router.asPath === item.link ? sharedStyles.color : "unset"
                  }
                  fontSize="2xl"
                  w="full"
                  py="2"
                  px="6"
                >
                  <NextLink href={item.link} passHref>
                    <LinkOverlay>{item.linkName}</LinkOverlay>
                  </NextLink>
                </Box>
              </LinkBox>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Drawer
        isOpen={isOpenSearch}
        placement="right"
        onClose={onCloseSearch}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="3xl" as="h2">
            Search
          </DrawerHeader>

          <DrawerBody>
            <SearchInput />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
