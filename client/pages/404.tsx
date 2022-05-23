import { Box, Flex, Heading, Stack, Text, Link } from "@chakra-ui/react";
import NextLink from "next/link";

const NotFound = () => {
  return (
    <Flex w="full" justifyContent="center" py="40">
      <Stack spacing={3} w="96">
        <Box>
          <Heading as="h3" size="xl">
            Oooops...
          </Heading>
          <Heading as="h4" size="lg">
            That page cannot be found.
          </Heading>
        </Box>
        <Text>
          Go back to the{" "}
          <NextLink href="/" passHref>
            <Link color="teal.500">Home</Link>
          </NextLink>{" "}
          page
        </Text>
      </Stack>
    </Flex>
  );
};

export default NotFound;
