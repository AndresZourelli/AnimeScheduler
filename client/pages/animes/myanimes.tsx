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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { EmailPasswordAuthNoSSR } from "@/components/Common/ThirdPartyEmailPasswordAuthNoSSR";

const MyAnimes = (props) => {
  const { user } = useAuth();
  const router = useRouter();
  const { tabIndex } = router.query;
  const { userAnimeLists } = useAnimeList({});
  const [getTab, setGetTab] = useState<number>(0);

  const onChangeTabs = (index: number) => {
    router.push(
      { pathname: "/animes/myanimes", query: { tabIndex: index } },
      undefined,
      { shallow: true }
    );
    setGetTab(index);
  };

  useEffect(() => {
    setGetTab(parseInt(tabIndex as string) || 0);
  }, [tabIndex]);
  return (
    <EmailPasswordAuthNoSSR>
      <Box>
        <Tabs
          orientation="vertical"
          isLazy
          onChange={onChangeTabs}
          index={getTab}
        >
          <TabList>
            <Tab>Currently Airing</Tab>
            <Tab>Not Watched</Tab>
            <Tab>Planning to watch</Tab>
            <Tab>Watching</Tab>
            <Tab>Paused</Tab>
            <Tab>Completed</Tab>
            <Tab>Rewatching</Tab>
            <Tab>Dropped</Tab>
            <Box fontSize="md" textAlign="center" px="2" py="3" mt="5">
              <Heading size="sm">Custom Lists</Heading>
            </Box>
            <Divider ml={2} />
            {userAnimeLists
              .sort((a, b) => {
                if (a.title === "default") {
                  return -1;
                } else if (b.title === "default") {
                  return 1;
                }
                return 0;
              })
              .map((list, idx) => (
                <Tab key={list.id}>{list.title}</Tab>
              ))}
          </TabList>
          <TabPanels>
            <TabPanel>
              <CurrentlyAiringTab />
            </TabPanel>
            <TabPanel>
              <Box m={5}>
                <Heading>Not Watched</Heading>
                <MyAnimePageList watchingStatus={WatchStatusTypes.NotWatched} />
                {/* "You aren't watching any anime currently..." */}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box m={5}>
                <Heading>Planning to Watch</Heading>

                {/* "You aren't planning to watch any anime..." */}
                <MyAnimePageList
                  watchingStatus={WatchStatusTypes.PlanToWatch}
                />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box m={5}>
                <Heading>Watching</Heading>
                <MyAnimePageList watchingStatus={WatchStatusTypes.Watching} />
                {/* "You aren't watching any anime currently..." */}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box m={5}>
                <Heading>Paused</Heading>
                <MyAnimePageList watchingStatus={WatchStatusTypes.Paused} />
                {/* "You aren't watching any anime currently..." */}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box m={5}>
                <Heading>Completed</Heading>

                {/* "You don't have any completed anime..." */}

                <MyAnimePageList watchingStatus={WatchStatusTypes.Completed} />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box m={5}>
                <Heading>Rewatching</Heading>
                <MyAnimePageList watchingStatus={WatchStatusTypes.Rewatching} />
                {/* "You aren't watching any anime currently..." */}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box m={5}>
                <Heading>Dropped</Heading>
                <MyAnimePageList watchingStatus={WatchStatusTypes.Dropped} />
                {/* "You aren't watching any anime currently..." */}
              </Box>
            </TabPanel>

            {userAnimeLists.map((list) => (
              <TabPanel key={list.id}>
                <Box m={5}>
                  <CustomList listId={list.id} listTitle={list.title} />
                </Box>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </EmailPasswordAuthNoSSR>
  );
};

export default MyAnimes;
