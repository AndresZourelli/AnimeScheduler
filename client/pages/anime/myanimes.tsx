import MyAnimePageList from "@/components/MyAnimePage/MyAnimePageList";
import WeeklyGrid from "@/components/MyAnimePage/WeeklyGrid";
import {
  Box,
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useQuery } from "urql";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { withAuthPrivate } from "@/lib/Auth/withAuth";

const CURRENTLY_WATCHING = `
  query CurrentlyWatching {
    allUserAnimes(condition: { watchingStatus: WATCHING }) {
      nodes {
        id
        listId
        listName
        title
        url
        watchingStatus
      }
    }
  }
`;

const PLANNING = `
  query PlanToWatch {
    allUserAnimes(condition: {watchingStatus: PLAN_TO_WATCH}) {
    nodes {
      id
      listId
      listName
      title
      url
      watchingStatus
    }
  }
  }
`;
const COMPLETED = `
  query PlanToWatch {
    allUserAnimes(condition: { watchingStatus: COMPLETED }) {
      nodes {
        id
        listId
        listName
        title
        url
        watchingStatus
      }
    }
  }
`;

const MyAnimes = (props) => {
  const { user } = useAuth();
  const [CurrentlyResult, CurrentlyFetch] = useQuery({
    query: CURRENTLY_WATCHING,
  });
  const [PlanningResult, PlanningFetch] = useQuery({
    query: PLANNING,
  });
  const [CompletedResult, CompletedFetch] = useQuery({
    query: COMPLETED,
  });
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
              {CurrentlyResult?.data?.allUserAnimes?.nodes.length === 0 ? (
                "You aren't watching any anime currently..."
              ) : (
                <MyAnimePageList
                  animes={CurrentlyResult?.data?.allUserAnimes?.nodes}
                />
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box m={5}>
              <Heading>Planning to Watch</Heading>
              {PlanningResult?.data?.allUserAnimes?.nodes.length === 0 ? (
                "You aren't planning to watch any anime..."
              ) : (
                <MyAnimePageList
                  animes={PlanningResult?.data?.allUserAnimes?.nodes}
                />
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box m={5}>
              <Heading>Completed</Heading>
              {CompletedResult?.data?.allUserAnimes?.nodes.length === 0 ? (
                "You don't have any completed anime..."
              ) : (
                <MyAnimePageList
                  animes={CompletedResult?.data?.allUserAnimes?.nodes}
                />
              )}
            </Box>
          </TabPanel>
        </TabPanels>
        <TabPanel>2</TabPanel>
      </Tabs>
      {/* <Box m={5}>
        <Heading>My Animes Page</Heading>
        <Box>
          <WeeklyGrid />
        </Box>
        <MyAnimePageList animes={UserResult?.data?.user?.userAnimes?.nodes} />
      </Box> */}
    </Box>
  );
};

export default withAuthPrivate(MyAnimes);
