import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Image,
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
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const NewStaff = ({ values, setFieldValue }) => {
  const [file, setFile] = useState<any>();
  const [error, setError] = useState({ code: "", message: "" });
  const [altName, setAltName] = useState({
    givenNameSearchBar: "",
    surnameSearchBar: "",
    nativeNameSearchBar: "",
    altNamesSearchBar: [{ name: "" }],
    description: "",
    language: "",
    image: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((files) => {
      let uploadedImage = {
        preview: URL.createObjectURL(files),
        width: 0,
        height: 0,
      };

      let combinedImage = Object.assign(files, uploadedImage);
      setFile(combinedImage);
      setError({ code: "", message: "" });
    });
  }, []);

  const addImageProcess = (src) => {
    return new Promise((resolve, reject) => {
      let img = document.createElement("img");
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject;
      img.src = src;
    });
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: "image/png, image/jpeg",
    validator: (files) => {
      if (files.size > 8000000) {
        return {
          code: "File Too Large",
          message: "File size is too large. Max limit is 8MB.",
        };
      }
    },
  });

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
    setFieldValue("newStaffList", [...values.newStaffList, altName]);
    setAltName({
      givenNameSearchBar: "",
      surnameSearchBar: "",
      nativeNameSearchBar: "",
      altNamesSearchBar: [{ name: "" }],
      description: "",
      image: "",
      language: "",
    });
    onClose();
  };

  useEffect(
    () => () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    },
    [file]
  );

  useEffect(() => {
    if (!isOpen) {
      setFile("");
      setError({ code: "", message: "" });
    }
  }, [isOpen]);

  useEffect(() => {
    const validateImageSize = async (src) => {
      let image = (await addImageProcess(src)) as any;
      let error;
      if (image.width < 230 || image.height < 345) {
        error = {
          code: "Incorrect Dimensions",
          message: "Images must be greater than or equal to 230x345px",
        };
      } else if (Math.abs(image.width / image.height - 2 / 3) > 0.01) {
        error = {
          code: "Incorrect Dimensions",
          message: "Images must have correct aspect ratio of 2:3",
        };
      }
      if (error) {
        setError(error);
      }
      setAltName((prev) => ({
        ...prev,
        image: Object.assign(file, image),
      }));
    };
    if (acceptedFiles) {
      acceptedFiles.forEach(async (files) => {
        await validateImageSize(file.preview);
      });
    }
  }, [acceptedFiles, file]);

  useEffect(() => {
    if (fileRejections.length > 0) {
      fileRejections.forEach((file) => {
        setError({
          code: file.errors[0].code,
          message: file.errors[0].message,
        });
      });
    }
  }, [fileRejections]);

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
              <Box w="full">
                <Text fontSize="md" mb={2}>
                  Upload Image
                </Text>
                <Box
                  {...getRootProps()}
                  border="3px dashed"
                  p={3}
                  borderRadius="xl"
                  alignItems="center"
                  cursor="pointer"
                  mb={3}
                >
                  {/* <Input {...getInputProps()} /> */}
                  <Text>
                    Drag &apos;n&apos; drop some files here, or click to select
                    files
                  </Text>
                </Box>
                {fileRejections.length == 0 && file && error.message == "" ? (
                  <Box d="flex" alignItems="center" flexDirection="column">
                    <Text p={3}>{file.name}</Text>
                    <Image
                      src={file.preview}
                      alt={file.name}
                      w={file.width}
                      h={file.height}
                    />
                  </Box>
                ) : (
                  <Text>{error.message}</Text>
                )}
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

export default NewStaff;
