import { createVar, fallbackVar, style, globalStyle } from '@vanilla-extract/css';

export const primaryColorVar = createVar();
export const secondaryColorVar = createVar();

// globalStyle(':root', {
//   vars: {
//     [primaryColorVar]: 'red',
//     [primaryColorVar]: 'yellow',
//   }
// })

const fbVar = fallbackVar(primaryColorVar, secondaryColorVar, '#fff')

export const styleDisplay = style({
  color: fbVar,
  background: 'limegreen',
  border: '2px solid lightblue',
  padding: '10px'
});