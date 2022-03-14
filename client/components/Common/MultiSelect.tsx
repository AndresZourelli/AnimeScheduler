import {
  Box,
  Flex,
  HStack,
  Icon,
  Input,
  ScaleFade,
  Tag,
  TagCloseButton,
  TagLabel,
  useDisclosure,
  useMultiStyleConfig,
  useOutsideClick,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsCircle } from "react-icons/bs";

interface Options {
  name: string;
  value: string | number;
}

interface MultiSelectProps {
  itemOptions: Options[];
  selectedItems: string[];
  addSelectedItem: (index: string) => void;
  removeSelectedItem: (index: number) => void;
}

const MultiSelect = (props: MultiSelectProps) => {
  const {
    itemOptions,
    selectedItems,
    removeSelectedItem,
    addSelectedItem,
    ...rest
  } = props;
  const [inputSearch, setInputSearch] = useState("");
  const styles = useMultiStyleConfig("Input", props);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef();
  useOutsideClick({ ref: ref, handler: () => onClose() });
  const toggleItem = (value: Options) => {
    if (selectedItems.find((item) => item === value.name)) {
      removeSelectedItem(
        selectedItems.findIndex((item) => item === value.name)
      );
    } else {
      addSelectedItem(value.name);
    }
  };

  const inputSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);
  };

  return (
    <Box position="relative" ref={ref}>
      <Box id="item" __css={styles.field} {...rest}>
        <Flex alignContent="center" w="full" height="full">
          <HStack maxW="full" alignItems="center">
            {selectedItems?.length > 0 ? (
              <Tag size="lg" onClick={onOpen} cursor="pointer">
                <TagLabel>{selectedItems[0]}</TagLabel>
                <TagCloseButton onClick={() => removeSelectedItem(0)} />
              </Tag>
            ) : null}
            {selectedItems?.length > 1 ? (
              <Tag
                size="lg"
                onClick={onOpen}
                cursor="pointer"
                minWidth="fit-content"
              >
                <TagLabel>+{selectedItems.length - 1}</TagLabel>
              </Tag>
            ) : null}
          </HStack>

          <Input
            variant="unstyled"
            role="button"
            onChange={inputSearchChange}
            onClick={onOpen}
            value={inputSearch}
          />
        </Flex>
      </Box>
      <Box
        position="absolute"
        zIndex="overlay"
        w="full"
        display={isOpen ? "block" : "none"}
      >
        <ScaleFade initialScale={0.9} in={isOpen} style={{ zIndex: 9999 }}>
          <Box
            mt="1"
            visibility={isOpen ? "visible" : "hidden"}
            maxH="250px"
            overflowY="auto"
            w="full"
            bg="gray.700"
            opacity="100%"
            borderRadius="md"
            py="2"
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
                padding: "2px",
              },

              "&::-webkit-scrollbar-thumb": {
                background: "gray.400",
                borderRadius: "24px",
              },
            }}
          >
            {itemOptions
              ?.filter((item) => {
                return (
                  item.name.toLowerCase().indexOf(inputSearch.toLowerCase()) !==
                  -1
                );
              })
              .map((item, itemIndex) => (
                <Box
                  _hover={{ bg: "gray.600" }}
                  cursor="pointer"
                  key={itemIndex}
                  py="1"
                  onClick={() => toggleItem(item)}
                >
                  <HStack px="3" spacing="4">
                    {selectedItems.find(
                      (existingItem) => existingItem === item.name
                    ) ? (
                      <Icon as={AiFillCheckCircle} color="green.200" />
                    ) : (
                      <Icon
                        as={BsCircle}
                        color="blue.200"
                        boxSize="16.33"
                        mr="1"
                      />
                    )}
                    <Box>{item.name}</Box>
                  </HStack>
                </Box>
              ))}
          </Box>
        </ScaleFade>
      </Box>
    </Box>
  );
};

export default MultiSelect;
