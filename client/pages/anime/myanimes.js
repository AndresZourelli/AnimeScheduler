import MyAnimePageList from "@/components/MyAnimePageList";
import WeeklyGrid from "@/components/WeeklyGrid";
import { Box, Heading } from "@chakra-ui/react";
import { initializeApollo } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import axios from "axios";

const MyAnimes = (props) => {
  return (
    <Box m={5}>
      <Heading>My Animes Page</Heading>
      <Box>
        <WeeklyGrid />
      </Box>
      <MyAnimePageList animes={props.animes} />
    </Box>
  );
};

const GET_MY_ANIME = gql`
  query GetMyAnime {
    getUserAnimes {
      success
      errors {
        message
      }
      animes {
        title
        image_url
        id: _id
      }
    }
  }
`;

export const getServerSideProps = async ({ req, res }) => {
  const refreshtoken = req.cookies["refresh-token"];
  const response = await axios.get("http://localhost:4000/refresh_token", {
    headers: { Cookie: "refresh-token=" + refreshtoken },
    withCredentials: true,
  });
  const token = response.data.accessToken;
  const client = initializeApollo(null, token);

  let result;
  try {
    result = await client.query({
      query: GET_MY_ANIME,
      headers: {
        authorization: `bearer ${token}`,
      },
    });
  } catch (error) {
    console.log("error", error.graphQLErrors[0]);
  }

  return {
    props: {
      animes: result?.data?.getUserAnimes?.animes ?? [],
    },
  };
};

export default MyAnimes;
