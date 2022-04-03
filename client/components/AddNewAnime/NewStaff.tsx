import ImageDropZone from "@/components/Common/ImageDropZone";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
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
import { useEffect, useState } from "react";
import { ExtendedFile } from "./NewCharacter";

const NewStaff = ({ append }) => {
  const [file, setFile] = useState<ExtendedFile | {}>({});
  const [error, setError] = useState({ code: "", message: "" });
  const [altName, setAltName] = useState({
    givenNameSearchBar: "",
    surnameSearchBar: "",
    nativeNameSearchBar: "",
    altNamesSearchBar: [{ name: "" }],
    description: "",
    language: "",
    imageFile: null,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e, index) => {
    const updatedData = [...altName.altNamesSearchBar];
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
    const updatedData = [...altName.altNamesSearchBar];
    updatedData.splice(index, 1);
    setAltName((prev) => ({
      ...prev,
      altNamesSearchBar: updatedData,
    }));
  };

  const onSave = () => {
    append({
      ...altName,
      name: altName.givenNameSearchBar + " " + (altName.surnameSearchBar ?? ""),
      imageFile: file,
    });
    setAltName({
      givenNameSearchBar: "",
      surnameSearchBar: "",
      nativeNameSearchBar: "",
      altNamesSearchBar: [{ name: "" }],
      description: "",
      imageFile: null,
      language: "",
    });
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setFile({});
      setAltName({
        givenNameSearchBar: "",
        surnameSearchBar: "",
        nativeNameSearchBar: "",
        altNamesSearchBar: [{ name: "" }],
        description: "",
        imageFile: null,
        language: "",
      });
      setError({ code: "", message: "" });
    }
  }, [isOpen]);

  return (
    <Box>
      <Button
        onClick={onOpen}
        leftIcon={<AddIcon />}
        colorScheme="teal"
        variant="solid"
      >
        Create New Staff
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Staff</ModalHeader>
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
                <Text fontSize="md" mb={2}>
                  Alternative Names
                </Text>
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
              <Box w="full" mb={3}>
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
              <ImageDropZone file={file} setFile={setFile} />
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

export default NewStaff;
