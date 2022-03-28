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

const NewProducer = ({ append }) => {
  const [producerData, setProducerData] = useState({
    name: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateChange = (e) => {
    setProducerData({ ...producerData, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    append(producerData);
    setProducerData({
      name: "",
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
        Create New Producer
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Producer</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex wrap="wrap">
              <FormControl mb={3}>
                <FormLabel>Producer Name</FormLabel>
                <Input
                  onChange={updateChange}
                  name="name"
                  value={producerData.name}
                />
              </FormControl>

              {/* <Box w="full" mb={3}>
                <Text fontSize="md" mb={2}>
                  Description
                </Text>
                <Textarea
                  name="description"
                  value={producerData.description}
                  onChange={updateChange}
                  w="full"
                />
              </Box> */}
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

export default NewProducer;
