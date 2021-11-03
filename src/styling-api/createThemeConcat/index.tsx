import React from "react";
import {
  styleConmmon,
  themeA,
  themeB,
  vars
} from './index.css'

console.log(vars)

const CreateThemeConcat = () => (
  <>
    <div className={themeA}>
      <div className={styleConmmon}>
        themeA
      </div>
    </div>

    <div className={themeB}>
      <div className={styleConmmon}>
        themeB
      </div>
    </div>
  </>
)

export default CreateThemeConcat