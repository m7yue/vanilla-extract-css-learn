import { recipe } from '@vanilla-extract/recipes';

export const button = recipe({
  base: {
    borderRadius: 6
  },

  variants: {
    color: {
      neutral: { background: 'lightblue' },
      brand: { background: 'blueviolet' },
      accent: { background: 'slateblue' }
    },
    size: {
      small: { padding: 12 },
      medium: { padding: 16 },
      large: { padding: 24 }
    },
    rounded: {
      true: { borderRadius: 999 }
    }
  },

  // Applied when multiple variants are set at once
  // 自定义样式， 会混合默认样式
  // 当调用时的各属性值和 variants 属性值完全匹配时生效（其实就是 样式 calssName 拼接）
  compoundVariants: [
    {
      variants: {
        color: 'neutral',
        size: 'small',
      },
      style: {
        background: 'lightgreen',
        padding: 20,
        height: '100px'
      }
    }
  ],

  defaultVariants: {
    color: 'accent',
    size: 'medium'
  }
});