import { createTheme, style } from "@vanilla-extract/css";

export const [themeClass, vars] = createTheme({
  color: {
    primary: "#764abc",
    secondary: "white",
  },
  font: {
    menu: "1.5em",
  },
});

export const menuClass = style({
  backgroundColor: vars.color.primary,
  fontSize: vars.font.menu,
  display: "block",
  width: "100%",
  overflow: 'hidden',
  color: "white",
  padding: 20,
  boxSizing: 'border-box'
});

export const titleClass = style({
  backgroundColor: vars.color.primary,
  color: vars.color.secondary,
  margin: 10,
  display: 'inline-block',
  boxSizing: 'border-box'
})

export const menuItemsClass = style({
  display: "flex",
  float: "right",
  flexDirection: "row",
  listStyle: "none",
  "@media": {
    "screen and (max-width: 768px)": {
      display: 'block',
      listStyle: "none",
      float: 'none'
    }
  }
});

export const menuItemClass = style({
  backgroundColor: vars.color.primary,
  color: vars.color.secondary,
  margin: 10,
  ":hover": {
    cursor: "pointer",
    color: "orange",
  },
});

export const sectionStyle = style({
  display: "inline-block",
  width: "100%",
  textAlign: "center",
  marginTop: "20%",
});