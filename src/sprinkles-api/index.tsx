import React from 'react';
import sprinkles, {
  mapResponsiveValue,
  normalizeResponsiveValue,
  ResponsiveValue,
  RequiredResponsiveValue
} from './sprinkles.css';
import * as styles from './index.css';

import './global.css'

import { vars } from './vars.css';

const SprinklesApi = () => (
  <div
    className={sprinkles({
      background: {
        lightMode: 'green-500',
        darkMode: 'gray-900',
      },
      height: '100vh',
      width: '100vw',
      display: 'flex',
      placeItems: 'center',
      padding: '6x',
    })}
  >
    <div className={styles.card}>
      <div
        className={sprinkles({
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: {
            mobile: '5x',
            desktop: '6x',
          },
        })}
      >
        <h1
          className={sprinkles({
            fontFamily: 'body',
            textAlign: 'center',
            typeSize: {
              mobile: '4x',
              tablet: '4x',
              desktop: '5x',
            },
          })}
        >
          <span role="img" aria-label="Waving hand">
            👋
          </span>
          <span role="img" aria-label="vanilla-extract logo">
            🧁
          </span>
          <span role="img" aria-label="Sprinkles logo">
            🍨
          </span>
        </h1>
        <h2
          className={sprinkles({
            fontFamily: 'body',
            color: {
              lightMode: 'green-700',
              darkMode: 'green-50',
            },
            textAlign: 'center',
            // typeSize: {
            //   mobile: '0x',
            //   tablet: '2x',
            //   desktop: '4x',
            // },
            typeSize: ['0x', '2x', '4x']
          })}
        >
          Hello from vanilla-extract and Sprinkles
        </h2>
      </div>
    </div>
  </div>
);

export default SprinklesApi


console.log(vars)

console.log(styles)

const className = sprinkles({
  background: {
    lightMode: 'green-50',
    darkMode: 'gray-800',
  },
  borderRadius: {
    mobile: '4x',
    desktop: '5x',
  },
  padding: {
    mobile: '7x',
    desktop: '8x',
  },
})
console.log(className)
console.log(sprinkles.properties instanceof Set) // true
console.log(sprinkles.properties.has('alignItems'))


const alignToFlexAlign = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  stretch: 'stretch'
} as const;
console.log(mapResponsiveValue('left', (value) => alignToFlexAlign[value]))
console.log(mapResponsiveValue(
  {
    mobile: 'center',
    desktop: 'left'
  } as const,
  (value, key) => {
    // key ==> defaultCondition
    return alignToFlexAlign[value]
  }
))
console.log(mapResponsiveValue(
  ['center', null, 'left'] as const,
  (value) => alignToFlexAlign[value]
))

console.log('===============normalizeResponsiveValue======================')
console.log(normalizeResponsiveValue('block'))
console.log(normalizeResponsiveValue(['none', null, 'block']))
console.log(normalizeResponsiveValue({
  mobile: 'none',
  desktop: 'block'
}))

console.log('===============ResponsiveAlign======================')
type ResponsiveAlign = ResponsiveValue<
  'left' | 'center' | 'right'
>;
const a: ResponsiveAlign = 'left';
const b: ResponsiveAlign = {
  mobile: 'center',
  desktop: 'left'
};
const c: ResponsiveAlign = ['center', null, 'left'];

console.log('===============ResponsiveAlign======================')
type ResponsiveAlign1 = RequiredResponsiveValue<
  'left' | 'center' | 'right'
>;
const a1: ResponsiveAlign1 = 'left';
const b1: ResponsiveAlign1 = {
  mobile: 'center',
  desktop: 'left'
};
const c1: ResponsiveAlign1 = ['center', null, 'left'];

// Type errors:
// const d1: ResponsiveAlign1 = [null, 'center'];
// const e1: ResponsiveAlign1 = { desktop: 'left'};
