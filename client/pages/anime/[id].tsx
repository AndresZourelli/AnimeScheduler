import { useRouter } from "next/router";
import { Spinner, Box, Flex } from "@chakra-ui/react";
import AnimePageInfoCol from "@/components/Home/AnimePageInfoCol";
import AnimePageMain from "@/components/Home/AnimePageMain";
import { useQuery } from "urql";

const GET_ANIME = `
  query SelectAnime($animeId: UUID!) {
    anime(id: $animeId) {
      ageRating {
        ageRatingType
      }
      airingStatus {
        airingStatusType
      }
      alternateAnimeNames {
        nodes {
          name
        }
      }
      animeCharacters(filter: {languageId: {equalTo: "4bb3de26-f4b2-4e44-8e65-364e32a19e22"}}) {
        nodes {
          character {
            id
            name
            characterImage {
            url
          }
          }
          characterRole {
            role
            id
          }
          language {
            language
          }
          person {
            firstName
            lastName
            id
            personImage {
            url
          }
          }
        }
      }
      animeGenres {
        nodes {
          genre {
            genre
          }
        }
      }
      animeLicensors {
        nodes {
          licensor {
            licensor
          }
        }
      }
      animeProducers {
        nodes {
          producer {
            producer
          }
        }
      }
      animeStaffs {
        nodes {
          person {
            firstName
            lastName
            id
            personImage {
              url
            }
          }
          staffRole {
            role
          }
        }
      }
      animeStudios {
        nodes {
          studio {
            studio
          }
        }
      }
      averageWatcherRating
      description
      duration
      endBroadcastDatetime
      mediaType {
        mediaType
      }
      numberOfEpisodes
      profileImage {
        url
      }
      season {
        season
      }
      sourceMaterial {
        sourceMaterialType
      }
      title
      startBroadcastDatetime
    }
  }
`;

const AnimePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [AnimeResult, AnimeQuery] = useQuery({
    query: GET_ANIME,
    variables: { animeId: id },
    pause: !id,
  });

  if (!id || !AnimeResult.data) {
    return (
      <Box>
        <Spinner size="xl" display="block" m="auto" my="10" />
      </Box>
    );
  }

  return (
    <Box position="relative">
      <Flex position="relative">
        <AnimePageInfoCol
          {...AnimeResult.data?.anime}
          fetching={AnimeResult.fetching}
        />
        <AnimePageMain
          {...AnimeResult.data?.anime}
          fetching={AnimeResult.fetching}
        />
      </Flex>
    </Box>
  );
};

export default AnimePage;
