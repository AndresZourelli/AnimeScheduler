import { useAuth } from "@/lib/Auth/FirebaseAuth";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const Account = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "test", username: user.username } });
  const onSubmit = (data) => console.log(data);
  return (
    <Box w="full">
      <Box m="auto">
        <Heading>Account Page</Heading>
      </Box>
      <Box w="500px" p="4" m="auto">
        <FormControl mb="2">
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input id="email" type="email" {...register("email")} />
          <FormHelperText>The email you signed up with.</FormHelperText>
        </FormControl>
        <FormControl mb="5">
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input id="username" {...register("username")} />
          <FormHelperText>The name others will see.</FormHelperText>
        </FormControl>
        <Box>
          <Text fontSize="md" mb="1">
            Password
          </Text>
          <Button>Change Password</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
