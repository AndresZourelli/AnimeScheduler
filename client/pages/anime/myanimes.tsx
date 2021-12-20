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

const MyAnimes = (props) => {
  const { user } = useAuth();
  const router = useRouter();
  const { userAnimeLists } = useAnimeList({});
  return (
    <Box>
      <Tabs orientation="vertical" isLazy>
        <TabList>
          <Tab>Currently Airing</Tab>
          <Tab>Watching</Tab>
          <Tab>Planning to watch</Tab>
          <Tab>Completed</Tab>
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
              <Heading>Currently Watching</Heading>
              <MyAnimePageList watchingStatus={WatchStatusTypes.Watching} />
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
              <Heading>Completed</Heading>

              {/* "You don't have any completed anime..." */}

              <MyAnimePageList watchingStatus={WatchStatusTypes.Completed} />
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
