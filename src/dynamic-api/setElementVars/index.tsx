import React, { useEffect, useRef } from 'react';

import { setElementVars } from '@vanilla-extract/dynamic';
import { vars } from './vars.css';

const SetElementVars = () => {
  useEffect(() => {
    const el = document.getElementById('myElement') as HTMLElement;

    // setElementVars(el, {
    //   [vars.colors.brand]: 'pink',
    //   [vars.colors.accent]: 'green'
    // });

    setElementVars(el, vars.colors, {
      brand: 'pink',
      accent: 'green'
    });
  }, [])

  return (<div id='myElement' style={{
    background: vars.colors.brand
  }}>aaaa</div>)
}

export default SetElementVars