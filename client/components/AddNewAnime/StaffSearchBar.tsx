import NewStaff from "@/components/AddNewAnime/NewStaff";
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
import { useGetPeopleQuery } from "@/graphql";

const StaffSearchBar = ({ fields, newPersonAppend, existingPersonAppend }) => {
  const ref = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const [queryResult, callQuery] = useGetPeopleQuery({
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

  const onClickExistingPerson = (id, name, imageUrl) => {
    existingPersonAppend({ personId: id, name, imageUrl });
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
                placeholder={"Search For Existing Person"}
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
              Search Results: {queryResult.data?.people.nodes.length}
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
                    {queryResult.data?.people.nodes.map((item) => {
                      return (
                        <Tr
                          key={item.id}
                          _hover={{
                            background: "blue.600",
                            color: "blue.50",
                          }}
                          onClick={() =>
                            onClickExistingPerson(
                              item.id,
                              item.firstName + " " + (item.lastName ?? ""),
                              item.personImage.url
                            )
                          }
                        >
                          <Td onClick={onPopoverClose}>
                            {item.firstName + (item.lastName ?? "")}
                          </Td>
                          <Td display="relative">
                            <Box w="70px" h="100px" position="relative">
                              <ImageLoader
                                image_url={item.personImage.url}
                                alt={
                                  item.firstName + " " + (item.lastName ?? "")
                                }
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
        <NewStaff append={newPersonAppend} />
      </Flex>
    </Box>
  );
};

export default StaffSearchBar;
