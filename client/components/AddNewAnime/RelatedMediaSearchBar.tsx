import NewStudio from "@/components/AddNewAnime/NewStudio";
import { useGetRelatedMediaQuery } from "@/graphql";
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
import ImageLoader from "@/components/Common/ImageLoader";

const RelatedMediaSearchBar = ({ append }) => {
  const ref = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const [queryResult, callQuery] = useGetRelatedMediaQuery({
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

  const onClickExistingRelatedMedia = (id, name, imageUrl, mediaType) => {
    append({ mediaId: id, name, imageUrl, mediaType });
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
              Search Results: {queryResult.data?.animes.nodes.length}
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
                    {queryResult.data?.animes.nodes.map((item) => {
                      return (
                        <Tr
                          key={item.id}
                          _hover={{
                            background: "blue.600",
                            color: "blue.50",
                          }}
                          onClick={() =>
                            onClickExistingRelatedMedia(
                              item.id,
                              item.title,
                              item.coverImage,
                              item.mediaType
                            )
                          }
                        >
                          <Td onClick={onPopoverClose}>{item.title}</Td>
                          <Td display="relative">
                            <Box w="70px" h="100px" position="relative">
                              <ImageLoader
                                image_url={item.coverImage}
                                alt={item.title}
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
      </Flex>
    </Box>
  );
};

export default RelatedMediaSearchBar;
