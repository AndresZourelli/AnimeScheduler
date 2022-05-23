import React, { useState } from "react";
import { Container, Box, Flex } from "@chakra-ui/react";
import NotificationSideBar from "@/components/Notification/NotificationSideBar";
import {
  NotificationType,
  UserNotification,
  useUserNotificationsQuery,
} from "@/graphql";
import AllNotificationsMain from "@/components/Notification/AllNotificationsMain";
import { EmailPasswordAuthNoSSR } from "@/components/Common/ThirdPartyEmailPasswordAuthNoSSR";

export enum AllNotifications {
  All = "ALL",
}

export const FilterNotifications = {
  ...NotificationType,
  ...AllNotifications,
} as const;

const component = (
  value: AllNotifications | NotificationType,
  data: UserNotification[] = []
) => {
  switch (value) {
    case FilterNotifications.Airing:
      return <>Test</>;
    default:
      return <AllNotificationsMain notifications={data} />;
  }
};

const NotificaitonsPage = () => {
  const [notificationType, setNotificationType] = useState<
    AllNotifications | NotificationType
  >(FilterNotifications.All);

  const [notificationsResult, fetchNotifications] = useUserNotificationsQuery();

  return (
    <EmailPasswordAuthNoSSR>
      <Flex minH="full" h="full" bg="gray.600" flexGrow="1">
        <NotificationSideBar
          selectedMenu={notificationType}
          setSelectedMenu={setNotificationType}
        />
        {component(
          notificationType,
          notificationsResult.data?.airingNotifications.nodes
        )}
      </Flex>
    </EmailPasswordAuthNoSSR>
  );
};

export default NotificaitonsPage;
