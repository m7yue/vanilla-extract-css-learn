import {
	globalKeyframes,
} from '@vanilla-extract/css';

// 全局定义 @keyframes
globalKeyframes('global-rotate', {
	'0%': { transform: 'rotate(0deg)' },
	'100%': { transform: 'rotate(360deg)' }
});