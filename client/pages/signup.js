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

const signup = () => {
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
        <Heading mb="5">Sign Up</Heading>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl id="password1" isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <FormControl id="password2" isRequired>
          <FormLabel>Re-Enter Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <Button mt="7">Sign Up</Button>
      </Box>
    </Box>
  );
};

export default signup;
