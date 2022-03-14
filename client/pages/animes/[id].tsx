import { useRouter } from "next/router";
import { Spinner, Box, Flex } from "@chakra-ui/react";
import AnimePageInfoCol from "@/components/Home/AnimePageInfoCol";
import AnimePageMain from "@/components/Home/AnimePageMain";
import { useQuery } from "urql";
import { useGetAnimeQuery, LanguageType } from "@/graphql";
import { useState, useEffect } from "react";

const AnimePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [getLanguage, setLanguage] = useState<LanguageType>(
    LanguageType.Japanese
  );
  const [getNumberOfCharacters, setNumberOfCharacters] = useState(10);
  const [getNumberOfStaff, setNumberOfStaff] = useState(10);
  const [getNextCharacters, setGetNextCharacters] = useState(null);
  const [getNextStaff, setGetNextStaff] = useState(null);

  const [AnimeResult, AnimeQuery] = useGetAnimeQuery({
    variables: {
      animeId: id,
      voiceActorLanguage: getLanguage,
      numOfAnimeToDisplay: 10,
      afterCursor: getNextCharacters,
      numOfStaffToDisplay: 10,
      StaffCursor: getNextStaff,
    },
    pause: !id,
  });

  const getMore = () => {
    if (AnimeResult?.data?.anime?.animeCharacters?.pageInfo?.hasNextPage) {
      setGetNextCharacters(
        AnimeResult.data.anime.animeCharacters.pageInfo.endCursor
      );
    }
  };

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
          getNext={getMore}
          {...AnimeResult.data?.anime}
          fetching={AnimeResult.fetching}
        />
      </Flex>
    </Box>
  );
};

export default AnimePage;
