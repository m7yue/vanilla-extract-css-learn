import React from "react";
import { button } from "./index.css";

console.log(
  button({
    color: 'accent',
    size: 'large',
    rounded: true
  })
)

const RecipesApi = () => (
  <button className= {button({
    color: 'neutral',
    // size: 'small',
    rounded: true
  })}>
    Hello world
  </button>
)

export default RecipesApi