import NewCharacter from "@/components/AddNewAnime/NewCharacter";
import { useGetCharactersQuery } from "@/graphql";
import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Tr,
  useOutsideClick,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import NextLink from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ImageLoader from "@/components/Common/ImageLoader";

const CharacterSearchBar = ({
  fields,
  newCharacterAppend,
  existingCharacterAppend,
}) => {
  const ref = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const [queryResult, callQuery] = useGetCharactersQuery({
    variables: { like: `${searchQuery}%` },
    pause: true,
  });

  useOutsideClick({
    ref: ref,
    handler: () => {
      setIsOpenPopover(false);
    },
  });

  const onPopoverClose = () => {
    setIsOpenPopover(false);
  };

  const updateQuery = () => {
    callQuery();
    if (searchQuery !== "") {
      setIsOpenPopover(true);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(debounce(updateQuery, 500), [searchQuery]);

  const onClickExistingCharacter = (id, name, imageUrl) => {
    existingCharacterAppend({ characterId: id, name, imageUrl });
    setIsOpenPopover(false);
  };

  useEffect(() => {
    if (searchQuery) {
      delayedSearch();
    }
    return delayedSearch.cancel;
  }, [searchQuery, delayedSearch]);

  return (
    <Box ref={ref}>
      <Flex mb={3}>
        <Popover isOpen={isOpenPopover} autoFocus={false}>
          <PopoverTrigger>
            <InputGroup w="50%">
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="gray.300" />}
              />
              <Input
                placeholder={"Search For Existing Character"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery !== "") {
                    setIsOpenPopover(true);
                  }
                }}
              />
            </InputGroup>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              Search Results: {queryResult.data?.characters.nodes.length}
            </PopoverHeader>
            <PopoverArrow />
            {queryResult.fetching ? (
              <PopoverBody m="auto">
                <Spinner size="xl" />
              </PopoverBody>
            ) : (
              <PopoverBody maxH="400px" overflow="auto">
                <Table>
                  <Tbody>
                    {queryResult.data?.characters.nodes.map((item) => {
                      return (
                        <Tr
                          key={item.id}
                          _hover={{
                            background: "blue.600",
                            color: "blue.50",
                          }}
                          onClick={() =>
                            onClickExistingCharacter(
                              item.id,
                              item.name,
                              item.characterImage.url
                            )
                          }
                        >
                          <Td onClick={onPopoverClose}>{item.name}</Td>
                          <Td display="relative">
                            <Box w="70px" h="100px" position="relative">
                              <ImageLoader
                                image_url={item.characterImage.url}
                                alt={item.name}
                                maxW="70px"
                                minH="100px"
                              />
                            </Box>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </PopoverBody>
            )}
          </PopoverContent>
        </Popover>
        <Spacer />
        <NewCharacter append={newCharacterAppend} />
      </Flex>
    </Box>
  );
};

export default CharacterSearchBar;
