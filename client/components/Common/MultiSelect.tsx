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
import { useFormContext, useFieldArray } from "react-hook-form";
import { MouseEventHandler } from "react";

interface Options {
  name: string;
  value: string | number;
}

interface MultiSelectProps {
  itemOptions: Options[];
  fieldName: string;
}

const MultiSelect = (props: MultiSelectProps) => {
  const { itemOptions, fieldName, ...rest } = props;
  const { control, register } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: fieldName,
    }
  );
  const [inputSearch, setInputSearch] = useState("");
  const styles = useMultiStyleConfig("Input", props);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef();
  const onMultiElementClickOut = () => {
    setInputSearch("");
    onClose();
  };
  useOutsideClick({ ref: ref, handler: () => onMultiElementClickOut() });
  const toggleItem = (e: React.MouseEvent<HTMLDivElement>, value: Options) => {
    e.stopPropagation();
    if (fields.find((item) => (item.name as any) === value.name)) {
      remove(fields.findIndex((item) => item.name === value.name));
    } else {
      append(value);
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
            {fields?.length > 0 ? (
              <Tag size="lg" onClick={onOpen} cursor="pointer">
                <TagLabel>{fields[0].name}</TagLabel>
                <TagCloseButton onClick={() => remove(0)} />
              </Tag>
            ) : null}
            {fields?.length > 1 ? (
              <Tag
                size="lg"
                onClick={onOpen}
                cursor="pointer"
                minWidth="fit-content"
              >
                <TagLabel>+{fields.length - 1}</TagLabel>
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
                  onClick={(e) => toggleItem(e, item)}
                >
                  <HStack px="3" spacing="4">
                    {fields.find(
                      (existingItem) => existingItem.name === item.name
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
