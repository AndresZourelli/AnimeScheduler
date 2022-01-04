import useAnimeList from "@/components/Hooks/useAnimeList";
import CustomList from "@/components/MyAnimePage/CustomList";
import MyAnimePageList from "@/components/MyAnimePage/MyAnimePageList";
import WeeklyGrid from "@/components/MyAnimePage/WeeklyGrid";
import { WatchStatusTypes } from "@/graphql";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { withAuthPrivate } from "@/lib/Auth/withAuth";
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

const MyAnimes = (props) => {
  const { user } = useAuth();
  const router = useRouter();
  const { tabIndex } = router.query;
  const { userAnimeLists } = useAnimeList({});
  const [getTab, setGetTab] = useState<number>(0);

  const onChangeTabs = (index: number) => {
    router.push(
      { pathname: "/anime/myanimes", query: { tabIndex: index } },
      undefined,
      { shallow: true }
    );
    setGetTab(index);
  };

  useEffect(() => {
    setGetTab(parseInt(tabIndex as string) || 0);
  }, [tabIndex]);
  return (
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
          <Box fontSize="md" textAlign="center" px="2" py="3">
            Custom Lists
          </Box>
          <Divider ml={2} />
          {userAnimeLists.map((list, idx) => (
            <Tab key={list.id}>
              {idx + 1} {list.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <WeeklyGrid />
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
              <MyAnimePageList watchingStatus={WatchStatusTypes.PlanToWatch} />
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
  );
};

export default withAuthPrivate(MyAnimes);
