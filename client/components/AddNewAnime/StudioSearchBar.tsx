import NewStudio from "@/components/AddNewAnime/NewStudio";
import { useGetStudiosQuery } from "@/graphql";
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
import { useCallback, useEffect, useRef, useState } from "react";

const StaffSearchBar = ({ newStudioAppend, existingStudioAppend }) => {
  const ref = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const [queryResult, callQuery] = useGetStudiosQuery({
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

  const onClickExistingStudio = (id, name) => {
    existingStudioAppend({ studioId: id, studioName: name });
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
                placeholder={"Search For Studio"}
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
              Search Results: {queryResult.data?.studios.nodes.length}
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
                    {queryResult.data?.studios.nodes.map((item) => {
                      return (
                        <Tr
                          key={item.id}
                          _hover={{
                            background: "blue.600",
                            color: "blue.50",
                          }}
                          onClick={() =>
                            onClickExistingStudio(item.id, item.studio)
                          }
                        >
                          <Td onClick={onPopoverClose}>{item.studio}</Td>
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
        <NewStudio append={newStudioAppend} />
      </Flex>
    </Box>
  );
};

export default StaffSearchBar;
