import ChangeEmailField from "@/components/Account/ChangeEmailField";
import ChangePasswordField from "@/components/Account/ChangePasswordField";
import ChangeUsernameField from "@/components/Account/ChangeUsernameField";
import { EmailPasswordAuthNoSSR } from "@/components/Common/EmailPasswordAuthNoSSR";
import { useAuth } from "@/lib/Auth/Auth";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const Account = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: user.email,
      username: user.username,
      password: null,
      verifyPassword: null,
    },
  });
  useEffect(() => {
    if (user?.email) {
      reset({ email: user.email, username: user.username });
    }
  }, [user, reset]);
  return (
    <EmailPasswordAuthNoSSR>
      <Box w="full" p="10">
        <VStack
          w="500px"
          p="4"
          m="auto"
          gap={3}
          bg="whiteAlpha.100"
          borderRadius="md"
        >
          <Box w="full">
            <FormControl mb="2">
              <FormLabel htmlFor="email">Email address</FormLabel>
              <Input readOnly id="email" type="email" {...register("email")} />
            </FormControl>
            <ChangeEmailField />
          </Box>
          <Box w="full">
            <FormControl mb="2">
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                readOnly
                id="username"
                type="username"
                {...register("username")}
              />
            </FormControl>
            <ChangeUsernameField />
          </Box>
          <Box w="full">
            <Text fontSize="md" mb="2">
              Password
            </Text>
            <ChangePasswordField />
          </Box>
        </VStack>
      </Box>
    </EmailPasswordAuthNoSSR>
  );
};

export default Account;
