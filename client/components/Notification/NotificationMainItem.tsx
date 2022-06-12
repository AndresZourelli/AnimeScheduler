import { useNotificationReadMutation, UserNotification } from "@/graphql";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  Link as ChakraLink,
  CloseButton,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";

interface NotificationMainItemProps {
  createdAt: UserNotification["createdAt"];
  entityId: UserNotification["entityId"];
  id: UserNotification["id"];
  isRead: UserNotification["isRead"];
  message: UserNotification["message"];
  [key: string]: any;
}

const NotificationMainItem = ({
  createdAt,
  entityId,
  id,
  isRead,
  message,
  ...props
}: NotificationMainItemProps) => {
  const [notificationReadResult, notificationRead] =
    useNotificationReadMutation();
  const readMessage = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    notificationRead({ id });
  };
  return (
    <Box {...props}>
      <HStack w="full">
        <Box w="full">
          <Flex gap={3} justifyContent="space-between">
            <Box>
              <Heading size="sm">Anime Just Aired</Heading>
            </Box>
            <Box>
              <Text fontSize="xs">
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                })}
              </Text>
            </Box>
          </Flex>
          <Box alignContent="start">
            <Text fontSize="sm">
              <Link href={`/animes/${entityId}`} passHref>
                <ChakraLink color="teal.500">{message}</ChakraLink>
              </Link>{" "}
              just aired.
            </Text>
          </Box>
        </Box>
        <CloseButton
          variant="ghost"
          size="sm"
          aria-label="mark notification as read"
          color="red"
          onClick={(e) => readMessage(e, id)}
        />
      </HStack>
    </Box>
  );
};

export default NotificationMainItem;
