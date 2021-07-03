import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Heading,
  Select,
  InputRightElement,
  InputGroup,
  CloseButton,
  Spacer,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Textarea,
} from "@chakra-ui/react";
import { Search2Icon, AddIcon } from "@chakra-ui/icons";
import { useState, useEffect, useRef } from "react";

const NewCharacter = ({ values, setFieldValue }) => {
  const [altName, setAltName] = useState({
    givenNameSearchBar: "",
    surnameSearchBar: "",
    nativeNameSearchBar: "",
    altNamesSearchBar: [{ name: "" }],
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e, index) => {
    let updatedData = [...altName.altNamesSearchBar];
    updatedData[index] = { name: e.target.value };
    setAltName((prev) => ({ ...prev, altNamesSearchBar: updatedData }));
  };

  const updateChange = (e) => {
    setAltName({ ...altName, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setAltName((prev) => ({
      ...prev,
      altNamesSearchBar: [...prev.altNamesSearchBar, { name: "" }],
    }));
  };

  const handleRemove = (index) => {
    let updatedData = [...altName.altNamesSearchBar];
    updatedData.splice(index, 1);
    setAltName((prev) => ({
      ...prev,
      altNamesSearchBar: updatedData,
    }));
  };

  const onSave = () => {
    setFieldValue("newCharactersList", [...values.newCharactersList, altName]);
    setAltName({
      givenNameSearchBar: "",
      surnameSearchBar: "",
      nativeNameSearchBar: "",
      altNamesSearchBar: [{ name: "" }],
      description: "",
      image: "",
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
        Create New Character
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Character</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex wrap="wrap">
              <FormControl>
                <FormLabel>Given name</FormLabel>
                <Input
                  onChange={updateChange}
                  name="givenNameSearchBar"
                  value={altName.givenNameSearchBar}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Surname</FormLabel>
                <Input
                  onChange={updateChange}
                  name="surnameSearchBar"
                  value={altName.surnameSearchBar}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Native Name</FormLabel>
                <Input
                  onChange={updateChange}
                  name="nativeNameSearchBar"
                  value={altName.nativeNameSearchBar}
                />
              </FormControl>
              <Box w="full">
                <Text fontSize="md">Alternative Names</Text>
                {altName.altNamesSearchBar.map((name, altNameIndex) => (
                  <FormControl key={altNameIndex} mb={3}>
                    <Input
                      value={altName.altNamesSearchBar[altNameIndex].name}
                      onChange={(event) => handleChange(event, altNameIndex)}
                    />
                    {altName.altNamesSearchBar.length > 1 ? (
                      <InputRightElement
                        children={
                          <CloseButton
                            color="red.500"
                            onClick={() => handleRemove(altNameIndex)}
                          />
                        }
                      />
                    ) : null}
                  </FormControl>
                ))}
                <Button onClick={handleAdd} mb={3} alignSelf="flex-end">
                  Add
                </Button>
              </Box>
              <Box w="full">
                <Text fontSize="md" mb={2}>
                  Description
                </Text>
                <Textarea
                  name="description"
                  value={altName.description}
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

export default NewCharacter;
