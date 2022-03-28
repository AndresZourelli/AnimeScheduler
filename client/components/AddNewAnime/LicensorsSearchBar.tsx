import NewLicensor from "@/components/AddNewAnime/NewLicensor";
import { useGetLicensorsQuery } from "@/graphql";
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

const LicensorSearchBar = ({
  fields,
  newLicensorAppend,
  existingLicensorAppend,
}) => {
  const ref = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const [queryResult, callQuery] = useGetLicensorsQuery({
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

  const onClickExistingLicensor = (id, name) => {
    existingLicensorAppend({ licensorId: id, name });
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
                placeholder={"Search For Licensor"}
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
              Search Results:{" "}
              {
                queryResult.data?.licensors.nodes.filter(
                  (licensor) =>
                    !fields.some(
                      (existingSelectedLicensor) =>
                        existingSelectedLicensor.licensorId === licensor.id
                    )
                ).length
              }
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
                    {queryResult.data?.licensors.nodes
                      .filter(
                        (licensor) =>
                          !fields.some(
                            (existingSelectedLicensor) =>
                              existingSelectedLicensor.licensorId ===
                              licensor.id
                          )
                      )
                      .map((item) => {
                        return (
                          <Tr
                            key={item.id}
                            _hover={{
                              background: "blue.600",
                              color: "blue.50",
                            }}
                            onClick={() =>
                              onClickExistingLicensor(item.id, item.licensor)
                            }
                          >
                            <Td onClick={onPopoverClose}>{item.licensor}</Td>
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
        <NewLicensor append={newLicensorAppend} />
      </Flex>
    </Box>
  );
};

export default LicensorSearchBar;
