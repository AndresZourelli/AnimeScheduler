import ImageLoader from "@/components/Common/ImageLoader";
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

export interface ExistingItem {
  itemId: string;
  name: string;
  imageUrl?: string;
}

const ItemSearchBar = ({
  existingFields,
  appendNewItem,
  appendExistingItem,
  queryResult,
  setSearch,
  newComponent,
  placeholder,
}) => {
  const ref = useRef();
  const [filteredResult, setFilteredResult] = useState<ExistingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const NewComponent = newComponent;

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
    setSearch(searchQuery);
    if (searchQuery !== "") {
      setIsOpenPopover(true);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(debounce(updateQuery, 500), [searchQuery]);

  const onClickExistingItem = (id, name, imageUrl = null) => {
    appendExistingItem({ itemId: id, name, imageUrl });
    setIsOpenPopover(false);
  };

  useEffect(() => {
    if (searchQuery) {
      delayedSearch();
    }
    return delayedSearch.cancel;
  }, [searchQuery, delayedSearch]);

  useEffect(() => {
    if (searchQuery === "") {
      setIsOpenPopover(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (queryResult.length > 0) {
      setFilteredResult(
        queryResult.filter(
          (item) =>
            !existingFields.some(
              (existingItem) => existingItem.itemId === item.itemId
            )
        )
      );
    }
  }, [queryResult, existingFields]);

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
                placeholder={placeholder}
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
              Search Results: {filteredResult.length}
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
                    {filteredResult.map((item) => {
                      return (
                        <Tr
                          key={item.itemId}
                          _hover={{
                            background: "blue.600",
                            color: "blue.50",
                          }}
                          onClick={() =>
                            onClickExistingItem(
                              item.itemId,
                              item.name,
                              item.imageUrl
                            )
                          }
                        >
                          <Td onClick={onPopoverClose}>{item.name}</Td>
                          {item.imageUrl && (
                            <Td display="relative">
                              <Box w="70px" h="100px" position="relative">
                                <ImageLoader
                                  image_url={item.imageUrl}
                                  alt={item.name}
                                  maxW="70px"
                                  minH="100px"
                                />
                              </Box>
                            </Td>
                          )}
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
        {NewComponent && <NewComponent append={appendNewItem} />}
      </Flex>
    </Box>
  );
};

export default ItemSearchBar;
