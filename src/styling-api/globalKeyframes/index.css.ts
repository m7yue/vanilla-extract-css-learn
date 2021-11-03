import { style } from '@vanilla-extract/css';

import './global.css'

export const animated = style({
	animation: `3s infinite global-rotate`,
	background: 'lightblue',
	width: '200px',
	height: '100px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	color: '#fff'
});