import ImageLoader from "@/components/Common/ImageLoader";
import { Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const StaffCard = ({ staff: { staff_id, staff_name, image_url, role } }) => {
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
      <NextLink href={`/staff/${staff_id}`}>
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
            {staff_name}
          </Heading>
          <Box width="125px" height="194px" position="relative" display="block">
            <ImageLoader image_url={image_url} alt={staff_name} />
          </Box>
          <Text fontSize="sm">Role: {role} </Text>
        </Box>
      </NextLink>
    </Box>
  );
};

export default StaffCard;
