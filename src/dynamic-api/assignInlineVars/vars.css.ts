import {
  createThemeContract,
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  colors: {
    brand: null,
    accent: null,
  }
});