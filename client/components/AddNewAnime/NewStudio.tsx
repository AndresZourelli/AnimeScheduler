import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

const NewStudio = ({ values, setFieldValue }) => {
  const [studioData, setStudioData] = useState({
    studioName: "",
    isPrimary: false,
    description: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateChange = (e) => {
    setStudioData({ ...studioData, [e.target.name]: e.target.value });
  };

  const onChecked = (e) => {
    setStudioData({ ...studioData, isPrimary: e.target.checked });
  };

  const onSave = () => {
    setFieldValue("newStudiosList", [...values.newStudiosList, studioData]);
    setStudioData({
      studioName: "",
      isPrimary: false,
      description: "",
    });
    onClose();
  };

  return (
    <Box>
      <Button
        onClick={onOpen}
        leftIcon={<AddIcon />}
        colorScheme="teal"
        variant="solid"
      >
        Create New Studio
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Studio</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex wrap="wrap">
              <FormControl mb={3}>
                <FormLabel>Studio Name</FormLabel>
                <Input
                  onChange={updateChange}
                  name="studioName"
                  value={studioData.studioName}
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Is Primary Studio?</FormLabel>
                <Checkbox
                  onChange={onChecked}
                  name="isPrimary"
                  value={studioData.isPrimary ? 1 : 0}
                />
              </FormControl>
              <Box w="full" mb={3}>
                <Text fontSize="md" mb={2}>
                  Description
                </Text>
                <Textarea
                  name="description"
                  value={studioData.description}
                  onChange={updateChange}
                  w="full"
                />
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSave}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NewStudio;
