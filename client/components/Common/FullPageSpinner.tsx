import { Box, Spinner } from "@chakra-ui/react";

const FullPageSpinner = () => {
  return (
    <Box
      w="100vw"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      display="flex"
    >
      <Spinner w="8rem" h="8rem" thickness="6px" />
    </Box>
  );
};

export default FullPageSpinner;
