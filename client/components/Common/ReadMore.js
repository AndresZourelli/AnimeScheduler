import {
  Spinner,
  Box,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

const ReadMore = ({ text = null }) => {
  const [readMore, setReadMore] = useState(false);
  const toggleReadMore = () => {
    console.log("running");
    setReadMore(!readMore);
  };
  const readMoreButton = () => {
    if (readMore) {
      return (
        <Text cursor="pointer" onClick={toggleReadMore}>
          Read Less...
        </Text>
      );
    } else {
      return (
        <Text cursor="pointer" onClick={toggleReadMore}>
          Read More...
        </Text>
      );
    }
  };

  return (
    <Box>
      {readMore ? <Text>{text}</Text> : <Text>{text?.slice(0, 500)}</Text>}
      {text?.length > 500 ? readMoreButton() : null}
    </Box>
  );
};

export default ReadMore;
