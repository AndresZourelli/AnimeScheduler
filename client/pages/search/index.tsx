import {
  Box,
  Input,
  Flex,
  InputGroup,
  InputRightElement,
  Icon,
  Button,
} from "@chakra-ui/react";
import { useSearchAnimesQuery } from "@/graphql";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchFilter from "@/components/Search/SearchFilter";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const router = useRouter();

  const [showAdvfilter, setShowAdvFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, querySearch] = useSearchAnimesQuery({
    variables: {
      searchInput: searchQuery,
    },
    pause: searchQuery === "",
  });

  const { search } = router.query;

  const onClickAdvFilter = () => {
    setShowAdvFilter(!showAdvfilter);
  };
  useEffect(() => {
    if (search) {
      setSearchQuery(search as string);
    }
  }, [search]);

  return (
    <Box p="5">
      <Flex py="5" justifyContent="center">
        <Box>
          <InputGroup w="30rem" mb="2">
            <Input placeholder="Search" />
            <InputRightElement children={<Icon as={FaSearch} />} />
          </InputGroup>
          <Button float="right" size="sm" onClick={onClickAdvFilter}>
            {showAdvfilter ? "Hide" : "Show"} Advanced Filter
          </Button>
        </Box>
      </Flex>
      {showAdvfilter ? <SearchFilter /> : null}
      <Box>
        {searchResult?.data?.searchAnimes?.nodes.map((anime) => (
          <Box key={anime.id}>
            {anime.title} {anime.altName}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Search;
