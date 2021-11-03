import {
  createThemeContract,
  createTheme,
  style
} from '@vanilla-extract/css';

// 约定主题变量
/**
  vars: {
    color: {
      brand: "var(--color-brand__mj96ge0)"
    },
    font: {
      body: "var(--font-body__mj96ge1)"
    }
  }
 */
export const vars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

export const themeA = createTheme(vars, {
  color: {
    brand: 'lightgreen'
  },
  font: {
    body: 'arial'
  },
});

export const themeB = createTheme(vars, {
  color: {
    brand: 'lightpink'
  },
  font: {
    body: 'comic sans ms'
  }
});

export const styleConmmon = style({
  backgroundColor: vars.color.brand,
  fontFamily: vars.font.body,
  display: "block",
  width: "100%",
  color: "white",
  padding: 20,
  boxSizing: 'border-box'
});