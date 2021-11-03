import { createVar, style } from '@vanilla-extract/css';

export const colorVar = createVar();

export const parentStyle = style({
  vars: {
    [colorVar]: 'lightgreen'
  },
  color: colorVar,
  background: 'lightsteelblue'
});

export const styleDisplay = style({
  width: '100px',
  height:'100px',
  background: colorVar,
  border: 'none',
  color: '#fff'
})