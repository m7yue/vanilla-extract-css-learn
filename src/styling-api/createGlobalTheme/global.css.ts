import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(':root', {
  color: {
    primary: "#764abc",
    secondary: "white",
  },
  font: {
    menu: "1.5em",
  },
});