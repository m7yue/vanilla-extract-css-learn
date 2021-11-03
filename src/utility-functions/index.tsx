import React from "react";
import { calcStyleClass, className, styles } from './index.css'

console.log(calcStyleClass)
console.log(styles)

const UtilityFunctions = () => (
  <div
    // className={calcStyleClass}
    style={styles}
  >
    <div className={className}>
      UtilityFunctions
    </div>
  </div>
)

export default UtilityFunctions