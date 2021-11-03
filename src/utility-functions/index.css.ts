import { calc } from '@vanilla-extract/css-utils';
import {
  style,
  createGlobalTheme,
} from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  space: {
    width: '50px',
    height: '50px'
  }
});

console.log(vars)


export const className = style({
	width: '200px',
	height: vars.space.height,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
  background: 'lightskyblue',
	color: '#fff'
});

// console.log(vars)
export const styles = {
  width: calc.multiply(vars.space.width, 6),
  height: calc.multiply(vars.space.height, 6),
  background: 'lightgreen',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

export const calcStyleClass = style(styles);
