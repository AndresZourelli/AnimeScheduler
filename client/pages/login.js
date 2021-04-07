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
import { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";

const USER_LOGIN = gql`
  query UserLogin($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      success
      errors {
        type
        message
      }
    }
  }
`;

const login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [loginUser, { loading, data }] = useLazyQuery(USER_LOGIN);

  const goBackClick = () => {
    router.push("/");
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onLoginClick = () => {
    if (email && password) {
      loginUser({ variables: { email: email, password: password } });
    }
  };

  useEffect(() => {
    if (data && data?.login?.success) {
      router.push("/");
    } else if (data && !data?.login?.success) {
      setIsError(true);
    }
  }, [data]);

  return (
    <Box p="12">
      <Box mb="10">
        <Button onClick={goBackClick}>
          <ArrowLeftIcon />
        </Button>
      </Box>
      <Box>
        <Heading mb="5">Login</Heading>
        <FormControl mb="3" id="email" isRequired isInvalid={isError}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="Email Address"
            onChange={onEmailChange}
            value={email}
          />
          <FormErrorMessage>
            You have entered an invalid username or password
          </FormErrorMessage>
        </FormControl>
        <FormControl mb="3" id="password" isRequired isInvalid={isError}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            onChange={onPasswordChange}
            value={password}
          />
        </FormControl>
        <Button onClick={onLoginClick} mt="7" mr="5">
          Login
        </Button>
        <Button mt="7">Forgot Password</Button>
      </Box>
    </Box>
  );
};

export default login;
