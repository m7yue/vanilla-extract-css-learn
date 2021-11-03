import { createTheme, createVar, fallbackVar, style } from "@vanilla-extract/css";
import { styleVariants } from '@vanilla-extract/css';

const BLUE = '#1658DC'
const WHITE = '#FFFFFF'
const BLUE_GRAY = '#4C5A75'
const BLACK = '#000000'

const GREEN = '#00FF00'

const blue = createVar();
const white = createVar();
const blueGray = createVar();
const black = createVar();

console.log(white)

export const [buttonTypeTheme, buttonTypeContract] = createTheme({
  vars: {
    [blue]: BLUE,
    [white]: WHITE,
    [blueGray]: BLUE_GRAY
  },

  color: {
    primary: fallbackVar(white, WHITE),
    secondary: fallbackVar(blue, BLUE),
    tertiary: fallbackVar(blueGray, BLUE_GRAY)
  },
  backgoundColor: {
    primary: fallbackVar(blue, BLUE),
    secondary: 'none',
    tertiary: 'none'
  },
  borderColor: {
    primary: 'none',
    secondary: fallbackVar(blue, BLUE),
    tertiary: fallbackVar(blueGray, BLUE_GRAY)
  },
  borderWidth: {
    primary: '0px 0px 0px',
    secondary: '2px 2px 1px',
    tertiary: '2px 2px 1px'
  },
})

const primaryActiveStyle = style({
  vars: {
    [black]: BLACK,
  },
  ':active': {
    backgroundColor: fallbackVar(black, BLACK)
  }
})

const secondaryActiveStyle = style({
  ':active': {
    backgroundColor: GREEN
  }
})

// const buttonType = {
//   primary: [
//     primaryActiveStyle,
//     {
//       borderWidth: buttonTypeContract.borderWidth.primary,
//       backgroundColor: buttonTypeContract.backgoundColor.primary,
//       borderColor: buttonTypeContract.borderColor.primary,
//       color: buttonTypeContract.color.primary,
//     }
//   ],
//   secondary: [
//     secondaryActiveStyle,
//     {
//       borderWidth: buttonTypeContract.borderWidth.secondary,
//       backgroundColor: buttonTypeContract.backgoundColor.secondary,
//       borderColor: buttonTypeContract.borderColor.secondary,
//       color: buttonTypeContract.color.secondary
//     }
//   ],
//   tertiary: {
//     borderWidth: buttonTypeContract.borderWidth.tertiary,
//     backgroundColor: buttonTypeContract.backgoundColor.tertiary,
//     borderColor: buttonTypeContract.borderColor.tertiary,
//     color: buttonTypeContract.color.tertiary
//   }
// };

const map: Record<string, {
  type: 'primary' | 'secondary'
  activeStyle: string
}> = {
  primary: {
    type: 'primary',
    activeStyle: primaryActiveStyle,
  },
  secondary: {
    type: 'secondary',
    activeStyle: secondaryActiveStyle,
  }
}
export const buttonTypeVar = styleVariants(
  map,
  (item) => {
    const { type, activeStyle } = item
    const {
      borderWidth,
      backgoundColor,
      borderColor,
      color
    } = buttonTypeContract
    const baseStyle = {
      borderWidth: borderWidth[type],
      backgroundColor: backgoundColor[type],
      borderColor: borderColor[type],
      color: color[type]
    }
    return [activeStyle, baseStyle]
  }
)