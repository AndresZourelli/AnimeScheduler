import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Heading,
  Button,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const login = () => {
  const router = useRouter();
  const goBackClick = () => {
    router.push("/");
  };
  return (
    <Box p="12">
      <Box mb="10">
        <Button onClick={goBackClick}>
          <ArrowLeftIcon />
        </Button>
      </Box>
      <Box>
        <Heading mb="5">Login</Heading>
        <FormControl mb="3" id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" placeholder="Email Address" />
        </FormControl>
        <FormControl mb="3" id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Password" />
        </FormControl>
        <Button mt="7">Login</Button>
      </Box>
    </Box>
  );
};

export default login;
