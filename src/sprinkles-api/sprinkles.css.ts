import {
  defineProperties,
  createSprinkles,

  // 就是连个简单的函数而已， 根据传值类型生成返回值， Array 类型和 responseArray 相关
  createMapValueFn,
  createNormalizeValueFn,

  ConditionalValue,
  RequiredConditionalValue
} from '@vanilla-extract/sprinkles';
import { vars } from './vars.css';

/**
 * 相当于定义了一个映射表
 * condition 定义一些环境适配条件
 * properties 定义哪些 css 属性值可用 (如果需要自定义添加， 可以参考 styles.card)
 * shorthands 自定义联合属性
 */
const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  // 定义哪些 css 属性和值可用
  properties: {
    display: ['none', 'flex'], // typescript 联想
    flexDirection: ['row', 'column'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    justifyContent: ['stretch', 'flex-start', 'center', 'flex-end'],
    gap: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    width: ['100vw'],
    height: ['100vh'],
    borderRadius: vars.borderRadius,
    fontFamily: vars.fontFamily,
    fontSize: vars.fontSize,
    lineHeight: vars.lineHeight,
    textAlign: ['center'],
  },
  // 自定义联合属性
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    placeItems: ['alignItems', 'justifyContent'], // alignItems 和 justifyContent 联合属性
    typeSize: ['fontSize', 'lineHeight'],
  },
  responsiveArray: ['desktop', 'tablet', 'mobile']
});

const colorModeProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { '@media': '(prefers-color-scheme: dark)' },
  },
  defaultCondition: 'lightMode',
  properties: {
    color: vars.color,
    background: vars.color,
  },
});


export const mapResponsiveValue = createMapValueFn(
  responsiveProperties
)

export const normalizeResponsiveValue = createNormalizeValueFn(responsiveProperties);

// responsive, colorMode ...
const sprinkles = createSprinkles(
  responsiveProperties,
  colorModeProperties,
);
export default sprinkles

export type ResponsiveValue<Value extends string | number> =
  ConditionalValue<typeof responsiveProperties, Value>;

export type RequiredResponsiveValue<
  Value extends string | number
> = RequiredConditionalValue<typeof responsiveProperties, Value>;