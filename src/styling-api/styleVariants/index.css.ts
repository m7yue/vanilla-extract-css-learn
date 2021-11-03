import { styleVariants, style, globalStyle } from '@vanilla-extract/css';

// export const variant = styleVariants({
//   primary: { background: 'blue' },
//   secondary: { background: 'aqua' }
// });

globalStyle(':root', {
  fontSize: '20px',
})

const base = style({
  height: '100px',
  width: '200px',
  color: '#fff',
  textAlign: 'center',
  lineHeight: 5, // 200/20/2 = 5
});

const backgrounds = {
  primary: 'blue',
  secondary: 'aqua'
} as const;

export const variant = styleVariants(
  backgrounds,
  (background) => [base, { background }]
);