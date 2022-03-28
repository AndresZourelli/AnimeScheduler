import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
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
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

const NewStudio = ({ append, ...props }) => {
  const [externalLinkData, setExternalLinkData] = useState({
    url: "",
    name: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateChange = (e) => {
    setExternalLinkData({
      ...externalLinkData,
      [e.target.name]: e.target.value,
    });
  };

  const onSave = () => {
    append({ ...externalLinkData });
    setExternalLinkData({
      url: "",
      name: "",
    });
    onClose();
  };

  return (
    <Box {...props}>
      <Button
        onClick={onOpen}
        leftIcon={<AddIcon />}
        colorScheme="teal"
        variant="solid"
      >
        Create New Link
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New External Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex wrap="wrap">
              <FormControl mb={3}>
                <FormLabel>Link Name</FormLabel>
                <Input
                  onChange={updateChange}
                  name="name"
                  value={externalLinkData.name}
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Link Url</FormLabel>
                <Input
                  onChange={updateChange}
                  name="url"
                  value={externalLinkData.url}
                />
              </FormControl>
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
