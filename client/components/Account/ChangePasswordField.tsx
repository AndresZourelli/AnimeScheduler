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
import { object, ref, string } from "yup";
import { debounce } from "lodash";
import axios from "axios";
import { useMeQuery } from "@/graphql";
import PasswordInput from "./PasswordInput";

interface PasswordInput {
  newPassword: string;
  newPasswordVerify: string;
  oldPassword: string;
}

const passwordSchema = object({
  newPassword: string().min(8).trim().required(),
  newPasswordVerify: string()
    .min(8)
    .trim()
    .required()
    .oneOf([ref("newPassword")], "Passwords do not match."),
  oldPassword: string().min(8).trim().required(),
}).required();

const ChangePasswordField = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PasswordInput>({
    defaultValues: {
      newPassword: "",
      newPasswordVerify: "",
      oldPassword: "",
    },
    mode: "onChange",
    resolver: yupResolver(passwordSchema),
  });

  const toast = useToast();

  const handleFormClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: PasswordInput) => {
    try {
      const result = await axios.post(
        "http://localhost:4000/auth/change-password",
        {
          newEmail: data.newPassword,
          password: data.oldPassword,
        },
        {
          withCredentials: true,
        }
      );
      if (result.status !== 200) {
        throw new Error("Unable to change user's password.");
      }
      reset();
      onClose();
    } catch (error: any) {
      toast({
        title: "An error occured while changing your password!",
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
      <Button onClick={onOpen}>Change Password</Button>
      <Modal isOpen={isOpen} onClose={handleFormClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl isInvalid={!!errors?.oldPassword?.message}>
                <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
                <PasswordInput id="oldPassword" register={register} />

                {!!errors?.oldPassword?.message ? (
                  <FormErrorMessage>
                    {errors?.oldPassword?.message}
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>
                    The old password that was used to sign in.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors?.newPassword?.message}>
                <FormLabel htmlFor="newPassword">New Password</FormLabel>
                <PasswordInput id="newPassword" register={register} />

                {!!errors?.newPassword?.message ? (
                  <FormErrorMessage>
                    {errors?.newPassword?.message}
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>
                    Please enter new password used to login.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors?.newPasswordVerify?.message}>
                <FormLabel htmlFor="newPasswordVerify">
                  Re-enter New Password
                </FormLabel>
                <PasswordInput id="newPasswordVerify" register={register} />

                {!!errors?.newPasswordVerify?.message ? (
                  <FormErrorMessage>
                    {errors?.newPasswordVerify?.message}
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>
                    Please enter new password used to login.
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

export default ChangePasswordField;
