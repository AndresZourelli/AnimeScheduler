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
        bg: mode("light_grey", "darkish_grey")(props),
        color: mode("desaturated_rose", "baby_pink")(props),
      },
    }),
  },
  colors: {
    baby_pink: "#FEDCE8",
    dusty_rose: "#CC9BA0",
    desaturated_rose: "#4D1C30",
    dark_grey: "#371C29",
    darkish_grey: "#604C4E",
    mid_dark_grey: "#51363C",
    light_grey: "#F2F0F2",
    lightish_grey: "#CDC4C4",
    mid_light_grey: "#DEDADA",
  },
  fonts: {
    body: "'Source Sans Pro'",
    heading: "'Balsamiq Sans'",
  },
  textStyles: {
    h2: {
      fontSize: "24pt",
    },
  },
  ...header,
});

export default customTheme;
