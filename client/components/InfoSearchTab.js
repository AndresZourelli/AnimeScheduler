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
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { Search2Icon, AddIcon } from "@chakra-ui/icons";
import { useState, useEffect, useRef } from "react";

const InfoSearchTab = ({
  push,
  values,
  setFieldValue,
  newItem,
  placeholder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const open = () => setIsOpenPopover(!isOpenPopover);
  const close = () => setIsOpenPopover(false);

  useEffect(() => {
    if (!isOpenPopover && searchQuery.length > 0) {
      setIsOpenPopover(true);
    }
  }, [searchQuery, isOpenPopover]);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        searchRef.current.contains(e.target) ||
        dropdownRef.current.contains(e.target)
      ) {
        return;
      }
      close();
    };
    document.addEventListener("mousedown", handleClick, false);
    return () => document.removeEventListener("mousedown", handleClick, false);
  }, []);

  return (
    <Box>
      <Flex mb={3}>
        <Popover
          isOpen={isOpenPopover}
          onClose={close}
          autoFocus={false}
          initialFocusRef={searchRef}
        >
          {({ isOpen, onClose }) => (
            <>
              <PopoverTrigger>
                <InputGroup w="50%">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Search2Icon color="gray.300" />}
                  />
                  <Input
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    ref={searchRef}
                  />
                </InputGroup>
              </PopoverTrigger>
              <PopoverContent ref={dropdownRef}>
                <PopoverHeader>Search Results: 0</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>Body</PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>
        <Spacer />
        {newItem}
      </Flex>
    </Box>
  );
};

export default InfoSearchTab;
