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

interface UsernameInput {
  username: string;
}

const usernameSchema = object({
  username: string()
    .min(3)
    .max(20)
    .matches(/^([a-zA-Z0-9\-_]*)$/, {
      message:
        "Username can only have letters, numbers, dashes, and underscores only. Please try again.",
    })
    .trim()
    .required(),
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
  } = useForm<UsernameInput>({
    defaultValues: {
      username: "",
    },
    mode: "onChange",
    resolver: yupResolver(usernameSchema),
  });
  const newUsername = watch("username");
  const [usernameResult, queryUsernameTaken] = useIsUsernameTakenQuery({
    variables: { usernameInput: newUsername },
    requestPolicy: "network-only",
    pause: true,
  });
  const [usernameChangeResult, changeUsername] = useChangeUsernameMutation();
  const toast = useToast();

  const onSubmit = (data: UsernameInput) => {
    changeUsername({ usernameInput: data.username }).then(() => {
      reset();
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceUsernameCheck = useCallback(debounce(queryUsernameTaken, 500), [
    queryUsernameTaken,
  ]);

  const handleFormClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (newUsername) {
      debounceUsernameCheck();
    }
    return debounceUsernameCheck.cancel;
  }, [newUsername, debounceUsernameCheck]);

  useEffect(() => {
    if (usernameResult?.data?.isUsernameTaken) {
      setError("username", {
        type: "manual",
        message: "The username is already taken.",
      });
    } else {
      if (errors?.username?.type === "manual") {
        clearErrors("username");
      }
    }
  }, [usernameResult, setError, clearErrors, errors]);

  useEffect(() => {
    if (usernameResult?.error) {
      toast({
        title: "An error occured while changing your username!",
        description: usernameResult?.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }, [usernameResult, toast]);

  return (
    <>
      <Button onClick={onOpen}>Change Username</Button>
      <Modal isOpen={isOpen} onClose={handleFormClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Username</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl isInvalid={!!errors?.username?.message}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input id="username" {...register("username")} />

                {!!errors?.username?.message ? (
                  <FormErrorMessage>
                    {errors?.username?.message}
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>The name others will see.</FormHelperText>
                )}
              </FormControl>
              <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
                Submit
              </Button>
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
