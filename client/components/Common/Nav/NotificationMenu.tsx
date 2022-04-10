import React, { useEffect, useState } from "react";
import { FaBell, FaRegBell } from "react-icons/fa";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
  Container,
  HStack,
  Text,
  Circle,
} from "@chakra-ui/react";
import {
  useNotificationsSubscription,
  UserNotification,
  useUnreadUserNotificationsQuery,
} from "@/graphql";
import { compareDesc } from "date-fns";
import NotificationMenuItem from "./NotificationMenuItem";

const compareCreateAt = (a: UserNotification, b: UserNotification) => {
  const convertA = new Date(a.createdAt);
  const convertB = new Date(b.createdAt);
  return compareDesc(convertA, convertB);
};

const NotificationMenu = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [numberOfUnread, setNumberOfUnread] = useState(0);
  const [notificationHistory, _] = useUnreadUserNotificationsQuery();
  const [notificationsSub] = useNotificationsSubscription({
    pause: notificationHistory.fetching,
  });

  useEffect(() => {
    if (!notificationHistory.fetching && notificationHistory.data) {
      setNotifications(notificationHistory.data.userNotifications.nodes);
      setNumberOfUnread(notificationHistory.data.userNotifications.totalCount);
    }
  }, [setNotifications, notificationHistory]);

  useEffect(() => {
    if (notificationsSub.data) {
      setNotifications((prev) => {
        return [
          ...prev,
          notificationsSub.data.notificationEvent.notification,
        ].sort(compareCreateAt);
      });
      setNumberOfUnread((prev) => prev + 1);
    }
  }, [notificationsSub]);
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="notifications"
        minW="50px"
        icon={
          <HStack p="2">
            {numberOfUnread > 0 && (
              <Circle bg="red.500" size="5">
                <Text fontSize="xs">{numberOfUnread}</Text>
              </Circle>
            )}
            <FaBell />
          </HStack>
        }
      />
      <MenuList>
        {notifications?.map((item) => (
          <NotificationMenuItem key={item.id} {...item} />
        ))}
      </MenuList>
    </Menu>
  );
};

export default NotificationMenu;
