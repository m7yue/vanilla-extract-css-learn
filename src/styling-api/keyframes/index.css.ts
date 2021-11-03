import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

export const animated = style({
	animation: `3s infinite ${rotate}`,
	background: 'lightblue',
	width: '200px',
	height: '100px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	color: '#fff'
});