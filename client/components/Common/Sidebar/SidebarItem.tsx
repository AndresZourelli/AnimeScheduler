import { Flex } from "@chakra-ui/react";
import { dataAttr } from "@chakra-ui/utils";

const SidebarItem = (props) => {
  const { isActive, children, ...rest } = props;
  const sharedStyles = { bg: "accent_color", color: "mid_dark_grey" };
  return (
    <Flex
      align="center"
      px="4"
      py="3"
      cursor="pointer"
      fontWeight="semibold"
      transition=".15s ease"
      _hover={sharedStyles}
      userSelect="none"
      _active={sharedStyles}
      data-active={dataAttr(isActive)}
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default SidebarItem;
