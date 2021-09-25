import ImageLoader from "@/components/Common/ImageLoader";
import { Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const StaffCard = ({
  staff: {
    firstName,
    lastName,
    id,
    personImage: { url },
  },
  role,
}) => {
  return (
    <Box
      overflow="hidden"
      d="flex"
      alignItems="center"
      flexDirection="column"
      position="relative"
      minH="150px"
      w="200px"
      flex="0 0 auto"
      mb="4"
    >
      <NextLink href={`/staff/${id}`}>
        <Box
          m="auto"
          position="relative"
          d="flex"
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
            {firstName + " " + (lastName ?? "")}
          </Heading>
          <Box width="125px" height="194px" position="relative" display="block">
            <ImageLoader image_url={url} alt={firstName + " " + lastName} />
          </Box>
          <Text fontSize="sm" textAlign="center" overflow="hidden">
            Role: {role}
          </Text>
        </Box>
      </NextLink>
    </Box>
  );
};

export default StaffCard;
