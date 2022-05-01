import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
} from "@chakra-ui/react";
import {
  useUnreadUserNotificationsQuery,
  NotificationType,
  useUserNotificationsQuery,
} from "@/graphql";
import NotificationSideBarMenuItem from "@/components/Notification/NotificationSideBarMenuItem";
import { AllNotifications, FilterNotifications } from "pages/notifications";

interface NotificationSideBarProps {
  selectedMenu: AllNotifications | NotificationType;
  setSelectedMenu: React.Dispatch<
    React.SetStateAction<NotificationType | AllNotifications>
  >;
}

const NotificationSideBar = ({ selectedMenu, setSelectedMenu, ...props }) => {
  const [notificationsResult, fetchNotifications] = useUserNotificationsQuery();
  const onClickSetActive = (value: AllNotifications | NotificationType) => {
    setSelectedMenu(value);
  };
  return (
    <Box
      {...props}
      bg="gray.800"
      w="60"
      minW="60"
      minH="full"
      zIndex="docked"
      overflowX="hidden"
      overflowY="auto"
      as="nav"
    >
      <Flex direction="column" fontSize="sm">
        <NotificationSideBarMenuItem
          aria-selected={FilterNotifications.All === selectedMenu}
          onClick={() => onClickSetActive(FilterNotifications.All)}
          notificationCount={
            notificationsResult.data?.allNotifications.totalCount
          }
        >
          <Text>All Notifications</Text>
        </NotificationSideBarMenuItem>
      </Flex>
    </Box>
  );
};

export default NotificationSideBar;
