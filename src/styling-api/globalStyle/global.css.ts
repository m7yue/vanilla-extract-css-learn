import { style, globalStyle } from '@vanilla-extract/css';
import { parentClass } from './index.css'

// globalStyle('html, body', {
//   background: 'red'
// });

globalStyle(`${parentClass} *`, {
  color: '#fff',
  textAlign: 'center'
});