import MyAnimePageList from "@/components/MyAnimePage/MyAnimePageList";
import WeeklyGrid from "@/components/MyAnimePage/WeeklyGrid";
import { useWatchingQuery, WatchingStatusEnum } from "@/graphql";
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
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const MyAnimes = (props) => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Box>
      <Tabs orientation="vertical">
        <TabList>
          <Tab>Currently Airing</Tab>
          <Tab>Watching</Tab>
          <Tab>Planning to watch</Tab>
          <Tab>Completed</Tab>
          <Tab>Custom Lists</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <WeeklyGrid />
          </TabPanel>
          <TabPanel>
            <Box m={5}>
              <Heading>Currently Watching</Heading>
              <MyAnimePageList watchingStatus={WatchingStatusEnum.Watching} />
              {/* "You aren't watching any anime currently..." */}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box m={5}>
              <Heading>Planning to Watch</Heading>

              {/* "You aren't planning to watch any anime..." */}
              <MyAnimePageList
                watchingStatus={WatchingStatusEnum.PlanToWatch}
              />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box m={5}>
              <Heading>Completed</Heading>

              {/* "You don't have any completed anime..." */}

              <MyAnimePageList watchingStatus={WatchingStatusEnum.Completed} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box m={5}>
              <Heading>Custom</Heading>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default withAuthPrivate(MyAnimes);
