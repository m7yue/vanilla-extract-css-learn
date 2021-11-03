import {
  createGlobalThemeContract,
  createGlobalTheme,
  createTheme,
  style
} from '@vanilla-extract/css';

/**
  vars: {
    color: {
      brand: "var(--color-brand)"
    },
    font: {
      body: "var(--font-body)"
    }
  }
 */
// export const vars = createGlobalThemeContract({
//   color: {
//     brand: 'color-brand'
//   },
//   font: {
//     body: 'font-body'
//   }
// });

// export const vars = createGlobalThemeContract(
//   {
//     color: {
//       brand: 'color-brand'
//     },
//     font: {
//       body: 'font-body'
//     }
//   },
//   value => `prefix-${value}`
// );

export const vars = createGlobalThemeContract(
  {
    color: {
      brand: 'color-brand'
    },
    font: {
      body: 'font-body'
    }
  },
  (value, path) => {
    console.log(path)
    return `prefix-${path.join('-')}`
  }
);


createGlobalTheme(':root', vars, {
  color: {
    brand: 'lightgreen'
  },
  font: {
    body: 'arial'
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