import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const InfoSearchTab = ({
  push,
  values,
  setFieldValue,
  newItem,
  placeholder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
        {newItem ? newItem : null}
      </Flex>
    </Box>
  );
};

export default InfoSearchTab;
