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

const NewLicensor = ({ append }) => {
  const [licensorData, setLicensorData] = useState({
    name: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateChange = (e) => {
    setLicensorData({ ...licensorData, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    append(licensorData);
    setLicensorData({
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
        Create New Licensor
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Licensor</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex wrap="wrap">
              <FormControl mb={3}>
                <FormLabel>Licensor Name</FormLabel>
                <Input
                  onChange={updateChange}
                  name="name"
                  value={licensorData.name}
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

export default NewLicensor;
