import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";

const PasswordInput = ({ id, register, ...props }) => {
  const [visible, setVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };
  return (
    <InputGroup {...props}>
      <Input type={visible ? "text" : "password"} {...register(id)} />
      <InputRightElement>
        <IconButton
          onClick={togglePasswordVisibility}
          variant="unstyled"
          aria-label="show password"
          icon={visible ? <ViewOffIcon /> : <ViewIcon />}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
