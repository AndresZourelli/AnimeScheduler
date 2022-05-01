import { Flex, Tag } from "@chakra-ui/react";
import React from "react";

interface NotificationSideBarMenuItemProps {
  children: any;
  notificationCount?: number;
  [key: string]: any;
}

const NotificationSideBarMenuItem = ({
  children,
  notificationCount = 0,
  ...rest
}: NotificationSideBarMenuItemProps) => {
  return (
    <Flex
      align="center"
      px="4"
      pl="4"
      py="3"
      cursor="pointer"
      _hover={{ bg: "gray.900", color: "gray.200" }}
      _selected={{ color: "white", bg: "blue.500" }}
      fontWeight="semibold"
      role="group"
      transition=".15s ease"
      {...rest}
    >
      <Flex justifyContent="space-between" w="full">
        {children}
        {notificationCount > 0 && (
          <Tag bg="red.400" color="white">
            {notificationCount}
          </Tag>
        )}
      </Flex>
    </Flex>
  );
};

export default NotificationSideBarMenuItem;
