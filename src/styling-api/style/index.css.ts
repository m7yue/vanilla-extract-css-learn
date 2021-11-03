import { createVar, style } from '@vanilla-extract/css';

// export const className = style({
// 	width: '200px',
// 	height: '100px',
// 	display: 'flex',
// 	justifyContent: 'center',
// 	alignItems: 'center',
// 	color: '#fff'
// });

const localVar = createVar();

export const parentClass = style({
	position: 'absolute',
	margin: '0 auto',
	left: '50%',
	transform: 'translateX(-50%)'
});

const base = style({ 
	width: '200px',
	height: '100px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	color: '#fff',
	background: 'lightseagreen',

	vars: {
    [localVar]: 'green',
    '--global-variable': 'purple'
  },

	':hover': {
    color: 'red'
  },

	selectors: {
    '&:nth-child(2n)': {
      background: '#fafafa',
			color: 'lightskyblue'
    },
		[`${parentClass}:hover &:nth-child(2n)`]: {
      background: 'lightyellow'
    },
  },

	'@media': {
    'screen and (min-width: 768px)': {
      padding: 100
    }
  },

	'@supports': {
    '(display: grid)': {
			display: 'grid'
    }
  }
});

// 可以很好的进行各种组合，这是一个很好的模式
export const className = style([
  base,
  {
		border: '6px solid #eee',
		':hover': {
			'transform': 'scale(1.1)'
		}
	}
]);
