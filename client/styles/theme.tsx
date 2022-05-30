import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import header from "@/styles/header";

const customTheme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  styles: {
    global: (props) => ({
      html: {
        minWidth: "356px",
        scrollBehavior: "smooth",
      },
      body: {
        fontWeight: "400",
        fontSize: "14pt",
      },
      "#__next": {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bg: mode("light_grey", "dark_grey")(props),
        color: mode("dark_grey", "accent_color")(props),
      },
    }),
  },
  colors: {
    mid_dark_grey: "#333333",
    light_grey: "#9E9E9E",
    lightish_grey: "#8C8C8C",
    mid_light_grey: "#757373",

    dark_grey: "#1C1C1C",
    main_color: "#EA95B9",
    accent_color: "#FDDDE8",
  },
  fonts: {
    body: "'Barlow'",
    heading: "'Barlow'",
  },
  components: {
    Heading: {
      baseStyle: {
        color: "main_color",
        fontWeight: "semibold",
      },
    },
    Text: {
      color: "accent_color",
    },
  },
  semanticTokens: {
    background: { active: "accent_color" },
  },
  ...header,
});

export default customTheme;
