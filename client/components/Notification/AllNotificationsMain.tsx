import React from "react";
import { Box } from "@chakra-ui/react";
import { useUnreadUserNotificationsQuery, UserNotification } from "@/graphql";
import NotificationMainItem from "@/components/Notification/NotificationMainItem";

interface AllNotificationsMenuProps {
  notifications: UserNotification[];
}

const AllNotificationsMain = ({
  notifications = [],
}: AllNotificationsMenuProps) => {
  return (
    <Box w="full" px="15" py="10" align="center">
      {notifications.map((notification) => (
        <NotificationMainItem
          key={notification.id}
          createdAt={notification.createdAt}
          entityId={notification.entityId}
          id={notification.id}
          isRead={notification.isRead}
          message={notification.message}
          mb="4"
          zIndex="dropdown"
          p="2"
          shadow="lg"
          rounded="lg"
          bg="gray.900"
          _hover={{ transform: "scale(1.03)" }}
          transition="all .3s ease-in-out"
          w="80%"
        />
      ))}
    </Box>
  );
};

export default AllNotificationsMain;
