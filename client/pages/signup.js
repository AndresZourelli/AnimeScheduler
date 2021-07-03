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
import { gql, useMutation } from "@apollo/client";

const SIGNUP = gql`
  mutation CreateUser(
    $username: String!
    $email: String!
    $password: String!
    $verifyPassword: String!
  ) {
    createUser(
      username: $username
      email: $email
      password: $password
      verifyPassword: $verifyPassword
    ) {
      success
      errors {
        type
        message
      }
    }
  }
`;

const signup = () => {
  const router = useRouter();
  const [signupUser, { data: signupUserResult }] = useMutation(SIGNUP);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [signupData, setSignupData] = useState({
    email: "",
    username: "",
    password: "",
    verifyPassword: "",
  });
  const goBackClick = () => {
    router.push("/");
  };
  const onSignupSubmit = () => {
    signupUser({ variables: signupData });
  };
  const onFormChange = (e) => {
    setSignupData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    if (signupData.password !== signupData.verifyPassword) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [signupData]);

  useEffect(() => {
    if (signupUserResult?.createUser?.success) {
      router.push("/");
    }
  }, [signupUserResult]);

  return (
    <Box p="12">
      <Box mb="10">
        <Button onClick={goBackClick}>
          <ArrowLeftIcon />
        </Button>
      </Box>
      <Box>
        <Heading mb="5">Sign Up</Heading>
        <FormControl
          mb="3"
          id="username"
          isRequired
          onChange={onFormChange}
          value={signupData.username}
        >
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            type="text"
            placeholder="Username"
            onChange={onFormChange}
            value={signupData.username}
          />
        </FormControl>
        <FormControl mb="3" id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={onFormChange}
            value={signupData.email}
          />
        </FormControl>
        <FormControl
          mb="3"
          id="password"
          isRequired
          onChange={onFormChange}
          value={signupData.password}
          isInvalid={buttonDisabled}
        >
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Password" />
          <FormErrorMessage>Passwords do not match!</FormErrorMessage>
        </FormControl>
        <FormControl
          mb="3"
          id="verifyPassword"
          isRequired
          onChange={onFormChange}
          value={signupData.verifyPassword}
          isInvalid={buttonDisabled}
        >
          <FormLabel>Re-Enter Password</FormLabel>
          <Input type="password" placeholder="Re-Enter Password" />
          <FormErrorMessage>Passwords do not match!</FormErrorMessage>
        </FormControl>
        <Button isDisabled={buttonDisabled} mt="7" onClick={onSignupSubmit}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default signup;
