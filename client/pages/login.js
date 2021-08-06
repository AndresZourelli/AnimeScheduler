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
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useAuth } from "@/components/Auth/FirebaseAuth";

const USER_LOGIN = gql`
  query UserLogin($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      success
      token
      errors {
        type
        message
      }
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    generateResetToken(email: $email)
  }
`;

const login = () => {
  const router = useRouter();
  const { signInUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [loginUser, { loading, data }] = useLazyQuery(USER_LOGIN);
  const [resetPassword, { data: resetPasswordResult }] = useMutation(
    RESET_PASSWORD,
    {
      variables: {
        email,
      },
    }
  );

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

  const onLoginClick = () => {
    if (email && password) {
      signInUser("email", email, password);
      // loginUser({ variables: { email: email, password: password } });
    }
  };

  useEffect(() => {
    if (data && data?.login?.success) {
      loginUserAccessToken(data.login.token);
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
            <Button onClick={onLoginClick} mt="7" mr="5">
              Login
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
