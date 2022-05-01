import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useIsUsernameTakenQuery, useChangeUsernameMutation } from "@/graphql";
import { useState, useEffect, useCallback } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { debounce } from "lodash";
import axios from "axios";
import { useMeQuery } from "@/graphql";

interface EmailInput {
  email: string;
  password: string;
}

const emailSchema = object({
  email: string().email().required(),
  password: string().trim().required(),
}).required();

const ChangeUsernameField = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<EmailInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: yupResolver(emailSchema),
  });
  const [_, queryMe] = useMeQuery({
    pause: true,
    requestPolicy: "network-only",
  });
  const toast = useToast();

  const handleFormClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: EmailInput) => {
    try {
      const result = await axios.post(
        "http://localhost:4000/auth/change-email",
        {
          newEmail: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );
      if (result.status !== 200) {
        throw new Error("Unable to change user's email.");
      }
      queryMe();
      reset();
      onClose();
    } catch (error: any) {
      toast({
        title: "An error occured while changing your email!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Change Email</Button>
      <Modal isOpen={isOpen} onClose={handleFormClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl isInvalid={!!errors?.email?.message}>
                <FormLabel htmlFor="email">New Email</FormLabel>
                <Input id="email" {...register("email")} />

                {!!errors?.email?.message ? (
                  <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    The new email address that will be used to login.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors?.password?.message}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />

                {!!errors?.password?.message ? (
                  <FormErrorMessage>
                    {errors?.password?.message}
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>
                    Please enter password used to login.
                  </FormHelperText>
                )}
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
              Submit
            </Button>
            <Button colorScheme="blue" mr={3} onClick={handleFormClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangeUsernameField;
