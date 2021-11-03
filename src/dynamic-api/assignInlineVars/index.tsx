import React from 'react';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from './vars.css';

const AssignInlineVars = () => (
  <>
    <section
      style={assignInlineVars({
        [vars.colors.brand]: 'pink',
        [vars.colors.accent]: 'green'
      })}
    >
      <div style={{background: vars.colors.brand}}>inlineVars</div>
      <div style={{background: vars.colors.accent}}>accent</div>
    </section>

    <section
      style={assignInlineVars(vars.colors, {
        brand: 'pink',
        accent: 'green'
      })}
    >
      <div style={{background: vars.colors.brand}}>inlineVars-contract</div>
      <div style={{background: vars.colors.accent}}>accent-contract</div>
    </section>
  </>
);

export default AssignInlineVars