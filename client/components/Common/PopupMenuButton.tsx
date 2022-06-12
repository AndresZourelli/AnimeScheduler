import {
  Box,
  IconButton,
  List,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { MouseEvent } from "react";
import { IoMdListBox } from "react-icons/io";

interface PopupMenuButtonProps {
  customList: any;
  animeId: string;
  addToNewList: any;
  addToExistingList: any;
}

const PopupMenuButton = ({
  customList,
  animeId,
  addToNewList,
  addToExistingList,
}: PopupMenuButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonAddToNewList = (e: MouseEvent) => {
    addToNewList(e, animeId);
    onClose();
  };
  const buttonAddToExistingList = (e: MouseEvent, listId: string) => {
    addToExistingList(e, animeId, listId);
    onClose();
  };
  return (
    <>
      <Popover
        isOpen={isOpen}
        placement="auto"
        closeOnBlur={true}
        onClose={onClose}
        closeOnEsc={true}
        isLazy
        returnFocusOnClose={false}
      >
        <Tooltip label="Add anime to custom list">
          <Box display="flex">
            <PopoverTrigger>
              <IconButton
                aria-label="Add anime to custom list"
                icon={<IoMdListBox />}
                isRound
                colorScheme="teal"
                size="sm"
                m="auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                mb="1"
              />
            </PopoverTrigger>
          </Box>
        </Tooltip>

        <Portal>
          <PopoverContent rootProps={{ zIndex: "popover" }}>
            <PopoverArrow />
            <PopoverHeader>Add to List:</PopoverHeader>
            <PopoverBody px="0">
              <List styleType="none">
                <ListItem
                  _hover={{ bg: "gray.600" }}
                  px="4"
                  py="2"
                  cursor="pointer"
                  onClick={buttonAddToNewList}
                >
                  Add to new list +
                </ListItem>
                {customList?.length > 0
                  ? customList.map((list) => (
                      <ListItem
                        key={list.id}
                        onClick={(e) => buttonAddToExistingList(e, list.id)}
                        cursor="pointer"
                        _hover={{ bg: "gray.600" }}
                        px="4"
                        py="2"
                      >
                        {list.title}
                      </ListItem>
                    ))
                  : null}
              </List>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
};

export default PopupMenuButton;
