import ImageLoader from "@/components/Common/ImageLoader";
import { Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { GetAnimeQuery, AnimeStaff } from "@/graphql";

type AnimeStaffType = GetAnimeQuery["anime"]["animeStaffs"]["nodes"][0];

const StaffCard: React.FC<AnimeStaffType> = ({ person, staffRole }) => {
  return (
    <Box
      overflow="hidden"
      display="flex"
      alignItems="center"
      flexDirection="column"
      position="relative"
      minH="150px"
      w="200px"
      flex="0 0 auto"
      mb="4"
    >
      <NextLink href={`/staff/${person.id}`}>
        <Box
          m="auto"
          position="relative"
          display="flex"
          flexDirection="column"
          alignItems="center"
          cursor="pointer"
        >
          <Heading
            display="block"
            size="md"
            wordBreak="normal"
            textAlign="center"
            justifySelf="center"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            mb="0"
          >
            {person.firstName + " " + (person.lastName ?? "")}
          </Heading>
          <Box width="125px" height="194px" position="relative" display="block">
            <ImageLoader
              image_url={person.personImage.url}
              alt={person.firstName + " " + person.lastName}
              maxW="125px"
            />
          </Box>
          <Text fontSize="sm" textAlign="center" overflow="hidden">
            Role: {staffRole.role}
          </Text>
        </Box>
      </NextLink>
    </Box>
  );
};

export default StaffCard;
