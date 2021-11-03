import {
  createThemeContract,
  style,
  assignVars,
  styleVariants
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  space: {
    small: null,
    medium: null,
    large: null
  }
});

// const as = assignVars(vars.space, {
//   small: '40px',
//   medium: '80px',
//   large: '160px'
// })
// console.log(as)

export const responsiveSpaceTheme = style({
  vars: assignVars(vars.space, {
    small: '40px',
    medium: '80px',
    large: '160px'
  }),
  '@media': {
    'screen and (min-width: 1024px)': {
      vars: assignVars(vars.space, {
        small: '80px',
        medium: '160px',
        large: '320px'
      })
    }
  }
});

const spaces = {
  small: 'small',
  medium: 'medium',
  large: 'large'
} as const

// 生成 className 对象
export const styleSizes = styleVariants(
  spaces,
  (size) => {
    const varSize = vars.space[size]
    return {
      width: varSize,
      height: varSize,
    }
  }
)

export const styleSmall = style({
  width: vars.space.small,
  height: vars.space.small
})

export const styleMedium = style({
  width: vars.space.medium,
  height: vars.space.medium
})

export const styleLarge = style({
  width: vars.space.large,
  height: vars.space.large
})