import {
  Box,
  Heading,
  Badge,
  IconButton,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from "@chakra-ui/react";
import LoadImage from "@/components/Common/ImageLoader";
import { BsPlus, BsX } from "react-icons/bs";
import { useMutation } from "urql";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import { useRouter } from "next/router";

const PopupMenuButton = ({ onClickInner, ...props }) => {
  return (
    <Menu preventOverflow={true}>
      <MenuButton
        as={IconButton}
        {...props}
        onClick={(e) => e.stopPropagation()}
      />
      <Portal>
        <MenuList>
          <MenuItem>Test</MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default PopupMenuButton;
