import useAnimeList from "@/components/Hooks/useAnimeList";
import CustomList from "@/components/MyAnimePage/CustomList";
import MyAnimePageList from "@/components/MyAnimePage/MyAnimePageList";
import CurrentlyAiringTab from "@/components/MyAnimePage/CurrentlyAiringTab";
import { WatchStatusTypes } from "@/graphql";
import { useAuth } from "@/lib/Auth/Auth";
import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Divider,
  useDisclosure,
  Icon,
  Collapse,
  Flex,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { EmailPasswordAuthNoSSR } from "@/components/Common/EmailPasswordAuthNoSSR";
import { MdKeyboardArrowRight } from "react-icons/md";
import MyAnimePageSidebar from "@/components/Common/Sidebar/MyAnimePageSidebar";
import {
  DisplayMenu,
  useMyAnimePageStore,
} from "@/lib/zustand/myAnimePageState";
import { HamburgerIcon } from "@chakra-ui/icons";

const MyAnimes = (props) => {
  const { user } = useAuth();
  const router = useRouter();
  const { tabIndex } = router.query;
  const { userAnimeLists } = useAnimeList({});
  const [getTab, setTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { resetState, displayedMenu } = useMyAnimePageStore();

  const changeSelectedTab = (e) => {
    console.log(e.target);
  };

  const onChangeTabs = (index: number) => {
    router.push(
      { pathname: "/animes/myanimes", query: { tabIndex: index } },
      undefined,
      { shallow: true }
    );
    setTab(index);
  };

  useEffect(() => {
    setTab(parseInt(tabIndex as string) || 0);
  }, [tabIndex]);

  useEffect(() => {
    resetState();
  }, [resetState]);

  const mainPage = () => {
    if (
      Object.values(DisplayMenu).includes(displayedMenu.menuName as DisplayMenu)
    ) {
      return (
        <Box m={5} flexGrow={1}>
          <Heading>{displayedMenu.menuName}</Heading>
          <MyAnimePageList watchingStatus={displayedMenu.watchStatus} />
          {/* "You aren't watching any anime currently..." */}
        </Box>
      );
    } else {
      return userAnimeLists
        .filter((item) => displayedMenu.menuName === item.id)
        .map((list) => (
          <Box m={5} key={list.id} flexGrow={1}>
            <CustomList listId={list.id} listTitle={list.title} />
          </Box>
        ));
    }
  };

  return (
    <EmailPasswordAuthNoSSR>
      <IconButton
        borderRadius="full"
        aria-label="Anime Lists"
        icon={<HamburgerIcon boxSize="6" />}
        onClick={onOpen}
        display={{ base: "block", md: "none" }}
        position="absolute"
        bottom="4"
        right="4"
        size="lg"
        colorScheme="teal"
        zIndex="docked"
      />
      <Drawer
        placement={"left"}
        size="full"
        onClose={onClose}
        isOpen={isOpen}
        isFullHeight
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" as="h2" fontSize="2xl">
            My Anime Lists
          </DrawerHeader>
          <DrawerBody>
            <MyAnimePageSidebar w="full" fontSize="xl" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Flex maxW="full" overflow="auto">
        <MyAnimePageSidebar
          minW="40"
          w="40"
          display={{ base: "none", md: "block" }}
        />
        {mainPage()}
      </Flex>
    </EmailPasswordAuthNoSSR>
  );
};

export default MyAnimes;
