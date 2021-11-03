import React from "react";
import {
  parentStyle,
  styleDisplay
} from './index.css'


const CreateVar = () => (
  <div className={parentStyle}>
    parentStyle
    <button className={styleDisplay}>styleDisplay</button>
  </div>
)

export default CreateVar