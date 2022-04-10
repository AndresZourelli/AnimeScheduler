import { UserNotification, useNotificationReadMutation } from "@/graphql";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link as ChakraLink,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";

const NotificationMenuItem = (props: UserNotification) => {
  const [notificationReadResult, notificationRead] =
    useNotificationReadMutation();
  const readMessage = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    notificationRead({ id });
  };
  return (
    <MenuItem>
      <HStack w="full">
        <Box w="full">
          <Flex gap={3} justifyContent="space-between">
            <Box>
              <Heading size="sm">Anime Just Aired</Heading>
            </Box>
            <Box>
              <Text fontSize="xs">
                {formatDistanceToNow(new Date(props.createdAt), {
                  addSuffix: true,
                })}
              </Text>
            </Box>
          </Flex>
          <Box>
            <Text fontSize="sm">
              <Link href={`/animes/${props.entityId}`} passHref>
                <ChakraLink color="teal.500">{props.message}</ChakraLink>
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
          onClick={(e) => readMessage(e, props.id)}
        />
      </HStack>
    </MenuItem>
  );
};

export default NotificationMenuItem;
