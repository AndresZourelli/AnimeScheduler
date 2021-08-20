/* eslint-disable react-hooks/rules-of-hooks */
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
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { FcGoogle } from "react-icons/fc";
import firebase from "firebase/app";
import "firebase/auth";
import { withAuthPublic } from "@/lib/Auth/withAuth";

const signup = () => {
  const router = useRouter();
  const { registerUser } = useAuth();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [signupData, setSignupData] = useState({
    email: "",
    username: "",
    password: "",
    verifyPassword: "",
  });

  const onGoogleSignUpClick = () => {
    registerUser("google");
  };

  const goBackClick = () => {
    router.push("/");
  };
  const onSignupSubmit = () => {
    registerUser(
      "email",
      signupData.username,
      signupData.email,
      signupData.password
    );
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
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        if (result.user) {
          router.push("/");
        }
      });
  });

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
        <Box>
          <Button
            w="full"
            mt="7"
            leftIcon={<FcGoogle />}
            onClick={onGoogleSignUpClick}
          >
            Sign-up with Google
          </Button>
        </Box>
        <Button isDisabled={buttonDisabled} mt="7" onClick={onSignupSubmit}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default withAuthPublic(signup);
