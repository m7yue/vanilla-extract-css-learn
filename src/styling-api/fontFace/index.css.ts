import { fontFace, style } from '@vanilla-extract/css';

const myFont = fontFace({
  src: 'local("Comic Sans MS")'
});

export const textClass = style({
  fontFamily: myFont
});
