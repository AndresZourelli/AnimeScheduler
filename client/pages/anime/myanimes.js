import MyAnimePageList from "@/components/MyAnimePage/MyAnimePageList";
import WeeklyGrid from "@/components/MyAnimePage/WeeklyGrid";
import { Box, Heading } from "@chakra-ui/react";
import { useQuery } from "urql";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { withAuthPrivate } from "@/lib/Auth/withAuth";

const GET_MY_ANIME = `
    query GetMyAnime($userId: String!) {
      user(id: $userId) {
        id
        userAnimes {
          nodes {
            anime {
              title
              id
              profileImage {
                id
                url
              }
            }
          }
        }
      }
    }
  `;

const MyAnimes = (props) => {
  const { user } = useAuth();
  const [UserResult, UserRefetch] = useQuery({
    query: GET_MY_ANIME,
    variables: { userId: user.uid },
  });
  return (
    <Box m={5}>
      <Heading>My Animes Page</Heading>
      <Box>
        <WeeklyGrid />
      </Box>
      <MyAnimePageList animes={UserResult?.data?.user?.userAnimes?.nodes} />
    </Box>
  );
};

export default withAuthPrivate(MyAnimes);
