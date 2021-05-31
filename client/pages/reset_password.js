import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Heading,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";

const VERIFY_TOKEN = gql`
  query VerifyToken($token: String!) {
    verifyResetToken(token: $token)
  }
`;

const UPDATE_PASSWORD = gql`
  mutation ChangePassword(
    $password: String!
    $verifyPassword: String!
    $token: String!
  ) {
    changePassword(
      password: $password
      verifyPassword: $verifyPassword
      token: $token
    ) {
      success
      message
    }
  }
`;

const reset_password = () => {
  const [passwordData, setPasswordData] = useState({
    password: "",
    verifyPassword: "",
    token: "",
  });
  const [getError, setGetError] = useState(false);
  const router = useRouter();
  const { token } = router.query;
  const { loading, error, data } = useQuery(VERIFY_TOKEN, {
    variables: { token },
    skip: !token,
  });
  const [updatePassword, { data: passwordResult }] = useMutation(
    UPDATE_PASSWORD,
    {
      variables: passwordData,
    }
  );

  useEffect(() => {
    setPasswordData((prevState) => ({ ...prevState, token }));
  }, [token]);

  useEffect(() => {
    if (passwordData.password !== passwordData.verifyPassword) {
      setGetError(true);
    } else {
      setGetError(false);
    }
  }, [passwordData]);

  if (loading) {
    return <Spinner size="xl"></Spinner>;
  }

  const onPasswordChange = (e) => {
    setPasswordData((prevState) => ({
      ...prevState,
      password: e.target.value,
    }));
  };
  const onVerifyPasswordChange = (e) => {
    setPasswordData((prevState) => ({
      ...prevState,
      verifyPassword: e.target.value,
    }));
  };

  const onPasswordSubmit = () => {
    updatePassword();
  };
  return (
    <Box>
      <Box m="8">
        {data?.verifyResetToken ? (
          <Box>
            <Heading mb="5">Reset Password</Heading>
            <FormControl mb="3" id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                onChange={onPasswordChange}
                value={passwordData.password}
                type="password"
                placeholder="New Password"
              />
            </FormControl>
            <FormControl mb="6" id="password1" isRequired isInvalid={getError}>
              <FormLabel>Re-Enter Password</FormLabel>
              <Input
                onChange={onVerifyPasswordChange}
                value={passwordData.verifyPassword}
                type="password"
                placeholder="Re-Enter Password"
              />
              <FormErrorMessage>Passwords Must Match</FormErrorMessage>
            </FormControl>
            <Button isDisabled={getError} onClick={onPasswordSubmit}>
              Submit
            </Button>
          </Box>
        ) : (
          <Heading margin="auto">Error</Heading>
        )}
      </Box>
    </Box>
  );
};

export default reset_password;
