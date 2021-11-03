import React, { FC } from "react";
import {
  responsiveSpaceTheme,
  styleSmall,
  styleMedium,
  styleLarge,
  styleSizes
} from './index.css'

console.log(styleSizes)

interface IProps {
  size: 'small' | 'medium' | 'large'
}

const AssignVars: FC<IProps> = (props) => (
  <div className={responsiveSpaceTheme}>
    <button className={styleSizes[props.size]}>click</button>

    <button className={styleSmall}>styleSmall</button>
    <button className={styleMedium}>styleMedium</button>
    <button className={styleLarge}>styleLarge</button>
  </div>
)

export default AssignVars