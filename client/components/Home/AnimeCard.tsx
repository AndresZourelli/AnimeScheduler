import LoadImage from "@/components/Common/ImageLoader";
import PopupMenuButton from "@/components/Common/PopupMenuButton";
import useAnimeList from "@/components/Hooks/useAnimeList";
import AddToListRow from "@/components/MyAnimePage/AddToListRow";
import { useCreateNewListMutation } from "@/graphql";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Table,
  Tbody,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsPlus, BsX } from "react-icons/bs";
import { IoMdListBox } from "react-icons/io";

const AnimeCard = ({
  title = null,
  url = null,
  score = null,
  id,
  likes = null,
  userSection = null,
}) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notification, setNotification] = useState("none");
  const [createNewList, setCreateNewList] = useState(false);
  const [newListName, setNewListName] = useState("");

  const {
    addAnimeResult,
    removeAnimeResult,
    addAnimeToList,
    removeAnimeFromList,
    user,
    error,
    userAnimeLists,
  } = useAnimeList({ inputAnimeId: id });

  const getNewListName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewListName((e.target as HTMLInputElement).value);
  };

  const [createNewListResult, runCreateNewList] = useCreateNewListMutation();
  const redirectToAnime = (e) => {
    router.push(`/anime/${id}`);
  };

  const onModalClose = () => {
    onClose();
    setCreateNewList(false);
  };

  const openModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onOpen();
  };

  const toggleCreateNewList = () => {
    setCreateNewList(!createNewList);
  };

  useEffect(() => {
    if (notification === "anime-added") {
      toast({
        title: "Anime Added!",
        description: `${title} successfully added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      setNotification("none");
    } else if (notification === "anime-removed") {
      toast({
        title: "Removed Anime!",
        description: `${title} removed from list.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      setNotification("none");
    }
  }, [addAnimeResult, error, title, toast, removeAnimeResult, notification]);
  return (
    <>
      <Box
        cursor="pointer"
        d="flex"
        alignItems="center"
        flexDirection="column"
        position="relative"
        onClick={redirectToAnime}
      >
        <Box
          width="full"
          h="full"
          display="block"
          position="relative"
          minH="346px"
          w="225px"
          borderRadius="lg"
          overflow="hidden"
        >
          <Text>Test</Text>
          <LoadImage image_url={url} alt={title} />
          <Badge
            position="absolute"
            zIndex="100"
            right="5"
            top="5"
            variant="solid"
            colorScheme="green"
            opacity="1"
          >
            {score}
          </Badge>
          <Flex
            position="absolute"
            right="3%"
            bottom="3%"
            flexDirection={"column"}
            justifyContent="center"
            alignContent="center"
            w="auto"
          >
            <IconButton
              aria-label="Remove anime from list button"
              icon={<IoMdListBox />}
              isRound
              bg="teal"
              size="sm"
              m="auto"
              isLoading={removeAnimeResult.fetching}
              onClick={openModal}
              visibility={user ? "visible" : "hidden"}
              mb="1"
            />
            {likes || userSection ? (
              <IconButton
                aria-label="Remove anime from list button"
                icon={<BsX size="2rem" />}
                isRound
                bg="red.300"
                onClick={openModal}
                isLoading={addAnimeResult.fetching}
                visibility={user ? "visible" : "hidden"}
              />
            ) : (
              <IconButton
                aria-label="Add anime from list button"
                icon={<BsPlus size="2rem" />}
                isRound
                bg="teal"
                isLoading={removeAnimeResult.fetching}
                onClick={openModal}
                visibility={user ? "visible" : "hidden"}
              />
            )}
          </Flex>
        </Box>
        <Heading
          height="20%"
          display="inline-block"
          width="calc(100%)"
          pt="3"
          size="xs"
          wordBreak="normal"
          textAlign="center"
          justifySelf="center"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {title}
        </Heading>
      </Box>
      <Modal isOpen={isOpen} onClose={onModalClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" pr="12">
            <Box>{title}</Box>
            <Spacer />
            {createNewList ? (
              <IconButton
                aria-label="Go back"
                onClick={toggleCreateNewList}
                icon={<ArrowBackIcon />}
              />
            ) : (
              <Button size="sm" onClick={toggleCreateNewList}>
                Create New List
              </Button>
            )}
          </ModalHeader>

          <ModalCloseButton />

          {createNewList ? (
            <ModalBody display="flex">
              <Text w="45%">New List Name:</Text>
              <Input placeholder="My favorites" onChange={getNewListName} />
            </ModalBody>
          ) : (
            <ModalBody maxH="80vh" overflow="auto">
              <AddToListRow animeId={id} />
            </ModalBody>
          )}
          {createNewList ? (
            <ModalFooter>
              <Button
                onClick={async () => {
                  const result = await runCreateNewList({
                    userId: user.uid,
                    title: newListName,
                  });
                  if (result.error) {
                    if (result.error.message.includes("duplicate key")) {
                      toast({
                        title: `Duplicate List`,
                        description: `The list "${newListName}" already exists.`,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                  }
                  if (result.data) {
                    toast({
                      title: `New List Successfully Created`,
                      description: `The list "${newListName}" was created.`,
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                      position: "top",
                    });
                  }
                  onModalClose();
                }}
              >
                Save
              </Button>
            </ModalFooter>
          ) : null}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AnimeCard;
