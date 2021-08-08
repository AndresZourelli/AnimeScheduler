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
  Text,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { FcGoogle } from "react-icons/fc";
import { set } from "lodash";
import firebase from "firebase/app";
import "firebase/auth";
import axios from "axios";

const login = () => {
  const router = useRouter();
  const { signInUser, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const goBackClick = () => {
    router.push("/");
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onLoginClick = async () => {
    setLoading(true);
    try {
      if (email && password) {
        await signInUser("email", email, password);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const onGoogleLoginClick = async () => {
    setLoading(true);
    try {
      router.push("/", undefined, { shallow: true });
      await signInUser("google");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <Box p="12">
      <Box mb="10">
        <Button onClick={goBackClick}>
          <ArrowLeftIcon />
        </Button>
      </Box>
      <Box>
        {showForgotPassword ? (
          resetPasswordResult ? (
            <>
              <Heading mb="5">Reset Password</Heading>
              <Text>Email with Reset Token sent!</Text>
            </>
          ) : (
            <>
              <Heading mb="5">Reset Password</Heading>
              <FormControl mb="3" id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="Email Address"
                  onChange={onEmailChange}
                  value={email}
                />
              </FormControl>
              <Button onClick={resetPassword} mt="7" mr="5">
                Submit
              </Button>
              <Button
                onClick={() => {
                  setShowForgotPassword(false);
                }}
                mt="7"
              >
                Cancel
              </Button>
            </>
          )
        ) : (
          <>
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
            <Box>
              <Button
                w="full"
                mt="7"
                leftIcon={<FcGoogle />}
                onClick={onGoogleLoginClick}
              >
                Login with Google
              </Button>
            </Box>
            <Button onClick={onLoginClick} mt="7" mr="5">
              Submit
            </Button>
            <Button
              mt="7"
              onClick={() => {
                setShowForgotPassword(true);
              }}
            >
              Forgot Password
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default login;
