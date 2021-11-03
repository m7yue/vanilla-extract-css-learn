import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Style from './styling-api/style'
import StyleVariants from './styling-api/styleVariants'
import GlobalStyle from './styling-api/globalStyle'

import CreateTheme from './styling-api/createTheme'
import CreateGlobalTheme from './styling-api/createGlobalTheme'

import CreateThemeConcat from './styling-api/createThemeConcat'
import CreateGlobalThemeConcat from './styling-api/createGlobalThemeConcat'

import AssignVars from './styling-api/assignVars';
import CreateVar from './styling-api/createVar';
import FallbackVar from './styling-api/fallbackVar';

import FontFace from './styling-api/fontFace'
import GlobalFontface from './styling-api/globalFontFace'

import Keyframes from './styling-api/keyframes'
import GlobalKeyframes from './styling-api/globalKeyframes'

import SprinklesApi from './sprinkles-api'

import RecipesApi from './recipes-api'

import AssignInlineVars from './dynamic-api/assignInlineVars'

import SetElementVars from './dynamic-api/setElementVars'

import UtilityFunctions from './utility-functions'

ReactDOM.render(
  <React.StrictMode>
    <Style />
    {/* <StyleVariants variant='secondary' /> */}
    {/* <GlobalStyle /> */}

    {/* <CreateTheme /> */}
    {/* <CreateGlobalTheme /> */}

    {/* <CreateThemeConcat /> */}
    {/* <CreateGlobalThemeConcat/> */}

    {/* <AssignVars size='small'/> */}
    {/* <CreateVar /> */}
    {/* <FallbackVar /> */}

    {/* <FontFace /> */}
    {/* <GlobalFontface /> */}

    {/* <Keyframes /> */}
    {/* <GlobalKeyframes /> */}


    {/* <SprinklesApi /> */}

    {/* <RecipesApi /> */}

    {/* <AssignInlineVars /> */}
    {/* <SetElementVars /> */}

    {/* <UtilityFunctions /> */}
  </React.StrictMode>,
  document.getElementById('root')
);
