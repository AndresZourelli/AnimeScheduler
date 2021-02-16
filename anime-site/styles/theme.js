import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const customTheme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  styles: {
    global: (props) => ({
      html: {
        minWidth: "356px",
        scrollBehavior: "smooth",
      },
      "#__next": {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bg: mode("white", "rgb(26, 32, 44)")(props),
      },
    }),
  },
});

export default customTheme;
